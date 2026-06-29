// =============================================================================
// Reminder Routes
// =============================================================================
// API endpoints for appointment, medication, and wellness reminders.
// All routes require authentication.
// =============================================================================

import { Router } from 'express';
import * as reminderController from '../controllers/reminder.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createReminderSchema } from '../types/requests.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createReminderSchema, 'body'), reminderController.create);
router.get('/', reminderController.list);
router.get('/upcoming', reminderController.getUpcoming);
router.delete('/:id', reminderController.remove);

export default router;