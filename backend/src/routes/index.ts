// =============================================================================
// Route Aggregator
// =============================================================================
// Combines all feature routes under a single `/api/v1` prefix.
// Each feature module is self-contained with its own router.
// =============================================================================

import { Router } from 'express';
import authRoutes from './auth.routes.js';
import checkinRoutes from './checkins.routes.js';
import goalRoutes from './goals.routes.js';
import reminderRoutes from './reminders.routes.js';
import safetyPlanRoutes from './safetyPlans.routes.js';
import educationRoutes from './education.routes.js';
import resourceRoutes from './resources.routes.js';
import tripAssistanceRoutes from './tripAssistance.routes.js';

const router = Router();

/**
 * API v1 route group.
 * All endpoints are prefixed with /api/v1.
 * Each feature module is mounted at its own path.
 */
router.use('/auth', authRoutes);
router.use('/checkins', checkinRoutes);
router.use('/goals', goalRoutes);
router.use('/reminders', reminderRoutes);
router.use('/safety-plans', safetyPlanRoutes);
router.use('/education', educationRoutes);
router.use('/resources', resourceRoutes);
router.use('/trip-assistance', tripAssistanceRoutes);

export default router;
