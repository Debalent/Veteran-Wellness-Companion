// =============================================================================
// Goal & Habit Routes
// =============================================================================
// API endpoints for wellness goal setting and habit tracking.
// All routes require authentication.
// =============================================================================

import { Router } from 'express';
import * as goalController from '../controllers/goal.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { createGoalSchema, updateGoalSchema, createHabitSchema, completeHabitSchema } from '../types/requests.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createGoalSchema, 'body'), goalController.create);
router.get('/', goalController.list);
router.patch('/:id', validate(updateGoalSchema, 'body'), goalController.update);
router.delete('/:id', goalController.remove);

// Habit sub-routes
router.post('/:goalId/habits', validate(createHabitSchema, 'body'), goalController.addHabit);
router.post('/habits/complete', validate(completeHabitSchema, 'body'), goalController.completeHabit);

export default router;