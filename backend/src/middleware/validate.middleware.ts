// =============================================================================
// Request Validation Middleware
// =============================================================================
// Validates incoming request bodies, query parameters, and URL params
// against Zod schemas. Ensures data integrity before it reaches controllers.
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Middleware factory that validates request data against a Zod schema.
 * Supports validation of body, query, and params.
 *
 * Usage:
 *   router.post(
 *     '/checkins',
 *     validate(createCheckinSchema, 'body'),
 *     checkinController.create
 *   )
 */
export function validate(schema: ZodSchema, source: 'body' | 'query' | 'params' = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      // Pass Zod errors to the error handler middleware
      next(result.error);
      return;
    }

    // Replace the source with the parsed (and potentially transformed) data
    req[source] = result.data;
    next();
  };
}