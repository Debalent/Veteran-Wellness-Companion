// =============================================================================
// Route Aggregator
// =============================================================================
// Combines all feature routes under a single `/api/v1` prefix.
// Each feature module is self-contained with its own router.
// =============================================================================

import { Router } from 'express';
import authRoutes from './auth.routes.js';
import checkinRoutes from './checkins.routes.js';

const router = Router();

/**
 * API v1 route group.
 * All endpoints are prefixed with /api/v1.
 * Each feature module is mounted at its own path.
 */
router.use('/auth', authRoutes);
router.use('/checkins', checkinRoutes);

export default router;