// =============================================================================
// Authentication Service
// =============================================================================
// Handles user registration and login business logic.
// Passwords are hashed before storage using bcrypt.
// Tokens are generated for authenticated sessions.
// =============================================================================

import { prisma } from '../config/database.js';
import { hashPassword, comparePassword, generateToken } from '../config/auth.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { logger } from '../utils/logger.js';

/**
 * Register a new user account.
 * Validates that the email is not already in use,
 * hashes the password, and returns a JWT token.
 */
export async function registerUser(data: {
  email: string;
  password: string;
  displayName?: string;
}) {
  // Check if the email is already registered
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new AppError(409, 'An account with this email already exists');
  }

  // Hash the password and create the user
  const passwordHash = await hashPassword(data.password);
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      displayName: data.displayName ?? data.email.split('@')[0] ?? 'Veteran',
    },
  });

  // Generate authentication token
  const token = generateToken({ userId: user.id, role: user.role });

  logger.info('User registered successfully', { userId: user.id });

  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
    },
    token,
  };
}

/**
 * Authenticate a user with email and password.
 * Returns a JWT token on success.
 */
export async function loginUser(email: string, password: string) {
  // Find the user by email
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(401, 'Invalid email or password');
  }

  // Verify the password
  const isValid = await comparePassword(password, user.passwordHash);
  if (!isValid) {
    throw new AppError(401, 'Invalid email or password');
  }

  // Generate authentication token
  const token = generateToken({ userId: user.id, role: user.role });

  logger.info('User logged in successfully', { userId: user.id });

  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
    },
    token,
  };
}

/**
 * Get user profile by ID.
 */
export async function getUserProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      displayName: true,
      role: true,
      consentedAt: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  return user;
}