// =============================================================================
// Rate Limiting Middleware
// =============================================================================
// Protects API endpoints from abuse by limiting request frequency.
// Stricter limits are applied to auth endpoints to prevent brute force.
// =============================================================================

import rateLimit from 'express-rate-limit';
import { env } from '../config/environment.js';

/**
 * General API rate limiter.
 * Applied to all API routes by default.
 */
export const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests',
    message: 'Please slow down and try again later.',
  },
});

/**
 * Strict rate limiter for authentication endpoints.
 * Prevents brute force attacks on login and registration.
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // 20 requests per 15 minutes
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many authentication attempts',
    message: 'Please try again after 15 minutes.',
  },
});