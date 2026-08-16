// =============================================================================
// Trip Assistance Service ("My Trips")
// =============================================================================
// API calls for the lightweight mobility feature — saved destinations,
// the "Get Me Home" shortcut, and human-assistance requests.
// =============================================================================

import api from './api';

export interface SavedTrip {
  id: string;
  label: string;
  origin: string;
  destination: string;
  notes?: string | null;
  isHome: boolean;
  needsAssistance: boolean;
  assistanceRequestedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SavedTripInput {
  label: string;
  origin: string;
  destination: string;
  notes?: string;
  isHome?: boolean;
}

export async function getSavedTrips(): Promise<SavedTrip[]> {
  const response = await api.get<SavedTrip[]>('/trip-assistance');
  return response.data;
}

export async function createSavedTrip(data: SavedTripInput): Promise<SavedTrip> {
  const response = await api.post<SavedTrip>('/trip-assistance', data);
  return response.data;
}

export async function updateSavedTrip(tripId: string, data: Partial<SavedTripInput>): Promise<SavedTrip> {
  const response = await api.patch<SavedTrip>(`/trip-assistance/${tripId}`, data);
  return response.data;
}

export async function deleteSavedTrip(tripId: string): Promise<void> {
  await api.delete(`/trip-assistance/${tripId}`);
}

export async function requestTripAssistance(tripId: string): Promise<SavedTrip> {
  const response = await api.post<SavedTrip>(`/trip-assistance/${tripId}/request-assistance`);
  return response.data;
}
