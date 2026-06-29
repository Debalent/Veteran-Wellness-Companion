// =============================================================================
// User Types
// =============================================================================
// TypeScript interfaces for user-related data structures.
// =============================================================================

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: 'VETERAN' | 'FAMILY_MEMBER' | 'CLINICIAN' | 'ADMIN';
  consentedAt?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName?: string;
}