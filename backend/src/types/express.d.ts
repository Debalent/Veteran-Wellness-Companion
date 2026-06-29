// =============================================================================
// Express Type Augmentation
// =============================================================================
// Extends Express Request to include the authenticated user context.
// This allows type-safe access to `req.user` in route handlers.
// =============================================================================

import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      /** Authenticated user context, set by the auth middleware. */
      user?: {
        userId: string;
        role: Role;
      };
    }
  }
}