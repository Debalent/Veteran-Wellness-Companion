// =============================================================================
// Safety Plan Routes
// =============================================================================
// API endpoints for personalized safety planning tools.
// Based on the VA Safety Plan framework — self-directed, not diagnostic.
// All routes require authentication.
// =============================================================================

import { Router } from 'express';
import * as safetyPlanController from '../controllers/safetyPlan.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createSafetyPlanSchema } from '../types/requests.js';

const router = Router();

router.use(authenticate);

router.put('/', validate(createSafetyPlanSchema, 'body'), safetyPlanController.upsert);
router.get('/', safetyPlanController.get);
router.delete('/', safetyPlanController.deactivate);

export default router;