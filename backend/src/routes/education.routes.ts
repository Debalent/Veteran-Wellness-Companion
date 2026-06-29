// =============================================================================
// Education Routes
// =============================================================================
// API endpoints for stress and resilience education content.
// Lesson listing is public; completion tracking requires auth.
// =============================================================================

import { Router } from 'express';
import * as educationController from '../controllers/education.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const router = Router();

// Public endpoints
router.get('/', educationController.listLessons);
router.get('/categories', educationController.getByCategory);
router.get('/:id', educationController.getLesson);

// Authenticated endpoints
router.post('/:id/complete', authenticate, educationController.complete);
router.get('/completed', authenticate, educationController.getCompleted);

export default router;