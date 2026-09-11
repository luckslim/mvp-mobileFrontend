export type UserRole = 'user' | 'admin';

export type PlaceStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type TouristPlace = {
  id: string;
  registrantId: string;
  name: string;
  description: string;
  suggestedVisitTime: string;
  location?: string | null;
  responsibleParty: string;
  imageUrl: string;
  status: PlaceStatus;
};

export type Session = {
  token: string;
  role: UserRole;
};

export type RootStackParamList = {
  Login: { role?: UserRole } | undefined;
  Register: undefined;
  Places: undefined;
  PlaceDetails: { place: TouristPlace };
  CreatePlace: undefined;
  Admin: undefined;
};
