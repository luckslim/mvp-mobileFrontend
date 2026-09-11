import { Platform } from 'react-native';
import Constants from 'expo-constants';
import { File } from 'expo-file-system';
import type { PlaceStatus, TouristPlace, UserRole } from '../types';
import { resolveApiUrl } from './api-url';
import { createEventFormData, type EventFormDataInput } from './event-form-data';

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL;
const expoHostUri = Constants.expoConfig?.hostUri ?? Constants.expoGoConfig?.debuggerHost;
export const API_URL = resolveApiUrl({
  configuredApiUrl,
  expoHostUri,
  platform: Platform.OS,
});
const REQUEST_TIMEOUT_MS = 8_000;

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type ApiErrorBody = {
  message?: string | string[];
};

function getErrorMessage(body: ApiErrorBody | null) {
  if (Array.isArray(body?.message)) {
    return body.message[0] ?? 'Não foi possível concluir a solicitação.';
  }

  return body?.message ?? 'Não foi possível concluir a solicitação.';
}

async function requestJson<T>(
  path: string,
  options: RequestInit = {},
  token?: string,
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response: Response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
      signal: options.signal ?? controller.signal,
    });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(
        'O servidor demorou para responder. Verifique se o backend está ligado e se o dispositivo está na mesma rede.',
        0,
      );
    }

    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique se o backend está ligado e se o dispositivo está na mesma rede.',
      0,
    );
  } finally {
    clearTimeout(timeoutId);
  }
  const body = (await response.json().catch(() => null)) as ApiErrorBody | T | null;

  if (!response.ok) {
    throw new ApiError(getErrorMessage(body as ApiErrorBody | null), response.status);
  }

  return body as T;
}

export type AuthenticationResponse = {
  access_Token: string;
  role: UserRole;
};

export async function authenticate(
  role: UserRole,
  email: string,
  password: string,
) {
  return requestJson<AuthenticationResponse>(`/authenticate/${role}`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export async function createUser(name: string, email: string, password: string) {
  return requestJson<{ id?: string }>('/create/user', {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
}

type BackendEventFields = {
  authorId?: unknown;
  title?: unknown;
  content?: unknown;
  time?: unknown;
  location?: unknown;
  colaborators?: unknown;
  fileUrl?: unknown;
  status?: unknown;
};

type BackendEvent = BackendEventFields & {
  id?: unknown;
  _id?: { value?: unknown };
  props?: BackendEventFields;
};

function asText(value: unknown, fallback = '') {
  return typeof value === 'string' ? value : value == null ? fallback : String(value);
}

function asOptionalText(value: unknown) {
  const text = asText(value).trim();
  return text || null;
}

function asPlaceStatus(value: unknown): PlaceStatus {
  return value === 'APPROVED' || value === 'REJECTED' || value === 'PENDING' ? value : 'PENDING';
}

function getBackendEventId(event: BackendEvent) {
  const directId = asText(event.id).trim();
  if (directId) {
    return directId;
  }

  const nestedId = asText(event._id?.value).trim();
  return nestedId || undefined;
}

function toTouristPlace(event: BackendEvent, fallbackId = 'place-unknown'): TouristPlace {
  const fields = event.props ?? event;

  return {
    registrantId: asText(fields.authorId),
    description: asText(fields.content, 'Descrição não informada.'),
    id: getBackendEventId(event) ?? fallbackId,
    imageUrl: asText(fields.fileUrl),
    location: asOptionalText(fields.location),
    name: asText(fields.title, 'Lugar sem nome'),
    responsibleParty: asText(fields.colaborators, 'Responsável não informado.'),
    status: asPlaceStatus(fields.status),
    suggestedVisitTime: asText(fields.time),
  };
}

function toTouristPlaces(events: BackendEvent[]) {
  const usedIds = new Set<string>();

  return events.map((event, index) => {
    const baseId = getBackendEventId(event) ?? `place-${index}`;
    let id = baseId;
    let suffix = 1;

    while (usedIds.has(id)) {
      id = `${baseId}-${index}-${suffix}`;
      suffix += 1;
    }

    usedIds.add(id);
    return toTouristPlace(event, id);
  });
}

export async function getTouristPlaces(token: string) {
  const response = await requestJson<{ event: BackendEvent[] }>('/get/events', {}, token);
  return toTouristPlaces(response.event ?? []);
}

export async function getMyTouristPlaces(token: string) {
  const response = await requestJson<{ event: BackendEvent[] }>('/get/events/mine', {}, token);
  return toTouristPlaces(response.event ?? []);
}

export type AdminTouristPlacesResponse = {
  places: TouristPlace[];
  pendingCount: number;
};

export async function getAdminTouristPlaces(token: string) {
  const response = await requestJson<{ events: BackendEvent[]; pendingCount?: unknown }>('/admin/events', {}, token);
  const places = toTouristPlaces(response.events ?? []);
  const fallbackCount = places.filter((place) => place.status === 'PENDING').length;
  const parsedCount = typeof response.pendingCount === 'number' ? Math.floor(response.pendingCount) : fallbackCount;

  return {
    pendingCount: Number.isFinite(parsedCount) && parsedCount >= 0 ? parsedCount : fallbackCount,
    places: [...places].sort((left, right) => Number(right.status === 'PENDING') - Number(left.status === 'PENDING')),
  } satisfies AdminTouristPlacesResponse;
}

export async function moderateTouristPlace(
  token: string,
  placeId: string,
  status: Extract<PlaceStatus, 'APPROVED' | 'REJECTED'>,
) {
  const response = await requestJson<{ event: BackendEvent }>(`/admin/events/${placeId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }, token);

  return toTouristPlace(response.event);
}

export async function deleteTouristPlace(token: string, placeId: string) {
  return requestJson<void>('/delete/event', {
    method: 'POST',
    body: JSON.stringify({ eventId: placeId }),
  }, token);
}

export type NewTouristPlace = EventFormDataInput;

export async function createTouristPlace(token: string, place: NewTouristPlace) {
  const file = place.image.file ?? new File(place.image.uri);
  const formData = createEventFormData(place, file);

  const response = await requestJson<{ event: BackendEvent }>('/create/event', {
    method: 'POST',
    body: formData,
  }, token);

  return toTouristPlace(response.event);
}
