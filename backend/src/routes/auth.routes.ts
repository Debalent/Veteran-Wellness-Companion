// =============================================================================
// Authentication Routes
// =============================================================================
// Defines API endpoints for user registration, login, and profile.
// Auth routes are publicly accessible (no JWT required for register/login).
// =============================================================================

import { Router } from 'express';
import * as authController from '../controllers/auth.controller.js';
import { validate } from '../middleware/validate.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.middleware.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { registerSchema, loginSchema } from '../types/requests.js';

const router = Router();

/**
 * POST /api/v1/auth/register
 * Create a new user account.
 * Rate limited to prevent abuse.
 */
router.post(
  '/register',
  authLimiter,
  validate(registerSchema, 'body'),
  authController.register
);

/**
 * POST /api/v1/auth/login
 * Authenticate with email and password.
 * Rate limited to prevent brute force attacks.
 */
router.post(
  '/login',
  authLimiter,
  validate(loginSchema, 'body'),
  authController.login
);

/**
 * GET /api/v1/auth/me
 * Get the currently authenticated user's profile.
 * Requires a valid JWT token.
 */
router.get(
  '/me',
  authenticate,
  authController.getProfile
);

export default router;