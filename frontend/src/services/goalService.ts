// =============================================================================
// Goal Service
// =============================================================================
// API calls for wellness goals and habits.
// =============================================================================

import api from './api';
import type { Goal, CreateGoalRequest } from '../types/goal';

export async function createGoal(data: CreateGoalRequest): Promise<Goal> {
  const response = await api.post<Goal>('/goals', data);
  return response.data;
}

export async function getGoals(includeInactive = false): Promise<Goal[]> {
  const response = await api.get<Goal[]>('/goals', {
    params: { includeInactive },
  });
  return response.data;
}

export async function updateGoal(id: string, data: Partial<Goal>): Promise<Goal> {
  const response = await api.patch<Goal>(`/goals/${id}`, data);
  return response.data;
}

export async function deleteGoal(id: string): Promise<void> {
  await api.delete(`/goals/${id}`);
}

export async function createHabit(goalId: string, data: { name: string; frequency: string }) {
  const response = await api.post(`/goals/${goalId}/habits`, data);
  return response.data;
}

export async function completeHabit(data: { habitId: string; date: string }) {
  const response = await api.post('/goals/habits/complete', data);
  return response.data;
}