// =============================================================================
// Check-in Service
// =============================================================================
// API calls for wellness check-ins.
// =============================================================================

import api from './api';
import type { WellnessCheckin, CreateCheckinRequest, CheckinTrend } from '../types/checkin';

export async function createCheckin(data: CreateCheckinRequest): Promise<WellnessCheckin> {
  const response = await api.post<WellnessCheckin>('/checkins', data);
  return response.data;
}

export async function getCheckins(params?: {
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}): Promise<{ data: WellnessCheckin[]; pagination: any }> {
  const response = await api.get('/checkins', { params });
  return response.data;
}

export async function getCheckinTrends(): Promise<CheckinTrend[]> {
  const response = await api.get<CheckinTrend[]>('/checkins/trends');
  return response.data;
}