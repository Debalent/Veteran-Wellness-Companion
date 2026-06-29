// =============================================================================
// Authentication Middleware
// =============================================================================
// Verifies JWT tokens on protected routes.
// Attaches the authenticated user context to the request object.
// All API routes except auth endpoints require this middleware.
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../config/auth.js';
import { logger } from '../utils/logger.js';

/**
 * Middleware that requires a valid JWT token for access.
 * Extracts the token from the Authorization header (Bearer scheme),
 * verifies it, and attaches the user context to the request.
 *
 * Usage: router.get('/checkins', authenticate, checkinController.list)
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    res.status(401).json({
      error: 'Authentication required',
      message: 'Please provide a valid access token.',
    });
    return;
  }

  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    res.status(401).json({
      error: 'Invalid authorization header',
      message: 'Authorization header must use Bearer scheme.',
    });
    return;
  }

  const token = parts[1]!;

  try {
    const decoded = verifyToken(token);
    req.user = {
      userId: decoded.userId,
      role: decoded.role as any,
    };
    next();
  } catch (error) {
    logger.warn('Invalid or expired token', { error });
    res.status(401).json({
      error: 'Invalid or expired token',
      message: 'Please authenticate again.',
    });
  }
}

/**
 * Middleware that restricts access to specific roles.
 * Must be used after the authenticate middleware.
 *
 * Usage: router.delete('/users/:id', authenticate, authorize('ADMIN'), userController.delete)
 */
export function authorize(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Authentication required',
        message: 'You must be authenticated to access this resource.',
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: 'Insufficient permissions',
        message: 'You do not have permission to perform this action.',
      });
      return;
    }

    next();
  };
}