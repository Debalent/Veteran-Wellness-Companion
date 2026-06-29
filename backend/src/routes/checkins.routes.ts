// =============================================================================
// Wellness Check-in Routes
// =============================================================================
// API endpoints for daily wellness and mood check-ins.
// All routes require authentication.
// =============================================================================

import { Router } from 'express';
import * as checkinController from '../controllers/checkin.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createCheckinSchema, checkinQuerySchema } from '../types/requests.js';

const router = Router();

// All check-in routes require authentication
router.use(authenticate);

router.post('/', validate(createCheckinSchema, 'body'), checkinController.create);
router.get('/', validate(checkinQuerySchema, 'query'), checkinController.list);
router.get('/trends', checkinController.trends);
router.get('/:id', checkinController.getById);

export default router;