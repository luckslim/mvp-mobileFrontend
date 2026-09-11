import * as SecureStore from 'expo-secure-store';
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Platform } from 'react-native';
import { authenticate } from '../lib/api';
import type { Session, UserRole } from '../types';

const SESSION_KEY = 'mage-verde-session-v2';

type WebStorage = {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
};

function getWebStorage() {
  return (globalThis as typeof globalThis & { localStorage?: WebStorage }).localStorage;
}

async function readSession() {
  const raw =
    Platform.OS === 'web'
      ? getWebStorage()?.getItem(SESSION_KEY)
      : await SecureStore.getItemAsync(SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

async function writeSession(session: Session) {
  const raw = JSON.stringify(session);

  if (Platform.OS === 'web') {
    getWebStorage()?.setItem(SESSION_KEY, raw);
    return;
  }

  await SecureStore.setItemAsync(SESSION_KEY, raw);
}

async function removeSession() {
  if (Platform.OS === 'web') {
    getWebStorage()?.removeItem(SESSION_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(SESSION_KEY);
}

type AuthContextValue = {
  session: Session | null;
  isLoading: boolean;
  signIn(email: string, password: string, role: UserRole): Promise<void>;
  signOut(): Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    readSession()
      .then(setSession)
      .finally(() => setIsLoading(false));
  }, []);

  async function signIn(email: string, password: string, role: UserRole) {
    const response = await authenticate(role, email, password);
    const nextSession: Session = {
      token: response.access_Token,
      role: response.role ?? role,
    };

    await writeSession(nextSession);
    setSession(nextSession);
  }

  async function signOut() {
    await removeSession();
    setSession(null);
  }

  const value = useMemo(
    () => ({ session, isLoading, signIn, signOut }),
    [isLoading, session],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth precisa ser usado dentro de AuthProvider.');
  }

  return context;
}
