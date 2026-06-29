// =============================================================================
// Auth Service
// =============================================================================
// API calls for user authentication.
// =============================================================================

import api from './api';
import type { AuthResponse, LoginRequest, RegisterRequest, User } from '../types/user';

export async function login(data: LoginRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
}

export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
}

export async function getProfile(): Promise<User> {
  const response = await api.get<User>('/auth/me');
  return response.data;
}