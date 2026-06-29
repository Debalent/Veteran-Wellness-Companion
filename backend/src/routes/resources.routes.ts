// =============================================================================
// Wellness Resource Routes
// =============================================================================
// API endpoints for the wellness resource library.
// All resource endpoints are publicly accessible (no auth required).
// =============================================================================

import { Router } from 'express';
import * as resourceController from '../controllers/resource.controller.js';

const router = Router();

router.get('/', resourceController.list);
router.get('/categories', resourceController.getByCategory);
router.get('/crisis', resourceController.getCrisis);
router.get('/:id', resourceController.getById);

export default router;