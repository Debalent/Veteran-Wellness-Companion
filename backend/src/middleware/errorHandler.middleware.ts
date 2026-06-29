// =============================================================================
// Error Handling Middleware
// =============================================================================
// Centralized error handling for the Express application.
// All unhandled errors bubble up to this middleware.
// In production, we avoid leaking error details to the client.
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logger } from '../utils/logger.js';

/**
 * Custom application error with HTTP status code.
 * Throw this from services and controllers for consistent error responses.
 */
export class AppError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public isOperational = true
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Main error handler middleware.
 * Handles different error types and returns consistent JSON responses.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  // Log the error with appropriate level
  if (err instanceof AppError && err.isOperational) {
    logger.warn('Operational error', {
      statusCode: err.statusCode,
      message: err.message,
    });
  } else {
    logger.error('Unexpected error', {
      error: err.message,
      stack: err.stack,
    });
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(400).json({
      error: 'Validation error',
      message: 'The request data is invalid.',
      details: err.errors.map((e) => ({
        field: e.path.join('.'),
        message: e.message,
      })),
    });
    return;
  }

  // Handle known application errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      message: err.isOperational ? err.message : 'An unexpected error occurred.',
    });
    return;
  }

  // Handle unexpected errors
  res.status(500).json({
    error: 'Internal server error',
    message: 'An unexpected error occurred. Please try again later.',
  });
}