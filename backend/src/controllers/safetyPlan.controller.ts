// =============================================================================
// Safety Plan Controller
// =============================================================================
// Handles HTTP request/response for personalized safety planning tools.
// This is a self-directed tool — not a clinical assessment.
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import * as safetyPlanService from '../services/safetyPlan.service.js';

export async function upsert(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const plan = await safetyPlanService.upsertSafetyPlan(userId, req.body);
    res.json(plan);
  } catch (error) {
    next(error);
  }
}

export async function get(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const plan = await safetyPlanService.getSafetyPlan(userId);
    res.json(plan ?? { message: 'No safety plan found' });
  } catch (error) {
    next(error);
  }
}

export async function deactivate(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const plan = await safetyPlanService.deactivateSafetyPlan(userId);
    res.json(plan);
  } catch (error) {
    next(error);
  }
}