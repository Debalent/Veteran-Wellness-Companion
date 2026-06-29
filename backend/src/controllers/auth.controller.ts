// =============================================================================
// Authentication Controller
// =============================================================================
// Handles HTTP request/response for user authentication endpoints.
// Delegates business logic to the auth service.
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';

/**
 * POST /api/v1/auth/register
 * Register a new user account.
 */
export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/auth/login
 * Authenticate a user and return a JWT token.
 */
export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/auth/me
 * Get the currently authenticated user's profile.
 */
export async function getProfile(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const profile = await authService.getUserProfile(userId);
    res.json(profile);
  } catch (error) {
    next(error);
  }
}