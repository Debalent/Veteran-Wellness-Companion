// =============================================================================
// Authentication Configuration
// =============================================================================
// JWT and bcrypt configuration for user authentication.
// Tokens are used for stateless API authentication.
// =============================================================================

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env } from './environment.js';

/**
 * JWT configuration constants derived from environment variables.
 */
export const jwtConfig = {
  secret: env.JWT_SECRET,
  expiresIn: env.JWT_EXPIRES_IN,
} as const;

/**
 * Hash a plain text password using bcrypt.
 * Used during user registration and password changes.
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, env.BCRYPT_SALT_ROUNDS);
}

/**
 * Compare a plain text password against a bcrypt hash.
 * Used during login to verify credentials.
 */
export async function comparePassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Generate a JWT token for an authenticated user.
 * The token contains the user ID and role for authorization.
 */
export function generateToken(payload: { userId: string; role: string }): string {
  return jwt.sign(payload, jwtConfig.secret, {
    expiresIn: jwtConfig.expiresIn as jwt.SignOptions['expiresIn'],
  });
}

/**
 * Verify and decode a JWT token.
 * Returns the decoded payload or throws if the token is invalid/expired.
 */
export function verifyToken(token: string): { userId: string; role: string } {
  return jwt.verify(token, jwtConfig.secret) as { userId: string; role: string };
}