// =============================================================================
// Trip Assistance Routes ("My Trips")
// =============================================================================
// Lightweight mobility feature: saved destinations, "Get Me Home" shortcut,
// and a human-assistance request flag. All routes require authentication.
// =============================================================================

import { Router } from 'express';
import * as tripAssistanceController from '../controllers/tripAssistance.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createSavedTripSchema, updateSavedTripSchema } from '../types/requests.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createSavedTripSchema, 'body'), tripAssistanceController.create);
router.get('/', tripAssistanceController.list);
router.patch('/:tripId', validate(updateSavedTripSchema, 'body'), tripAssistanceController.update);
router.delete('/:tripId', tripAssistanceController.remove);
router.post('/:tripId/request-assistance', tripAssistanceController.requestAssistance);

export default router;
