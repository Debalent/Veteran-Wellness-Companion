// =============================================================================
// Goal Controller
// =============================================================================
// Handles HTTP request/response for wellness goal and habit endpoints.
// Veterans use these to set and track wellness goals.
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import * as goalService from '../services/goal.service.js';

/**
 * POST /api/v1/goals
 * Create a new wellness goal.
 */
export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const goal = await goalService.createGoal(userId, req.body);
    res.status(201).json(goal);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/goals
 * Get all goals for the authenticated user.
 */
export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const includeInactive = req.query.includeInactive === 'true';
    const goals = await goalService.getGoals(userId, includeInactive);
    res.json(goals);
  } catch (error) {
    next(error);
  }
}

/**
 * PATCH /api/v1/goals/:id
 * Update a goal's progress, title, or status.
 */
export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const goal = await goalService.updateGoal(userId, req.params.id!, req.body);
    res.json(goal);
  } catch (error) {
    next(error);
  }
}

/**
 * DELETE /api/v1/goals/:id
 * Delete a goal and its associated habits.
 */
export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    await goalService.deleteGoal(userId, req.params.id!);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/goals/:goalId/habits
 * Add a habit to a goal.
 */
export async function addHabit(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const habit = await goalService.createHabit(userId, req.params.goalId!, req.body);
    res.status(201).json(habit);
  } catch (error) {
    next(error);
  }
}

/**
 * POST /api/v1/goals/habits/complete
 * Log completion of a habit for streak tracking.
 */
export async function completeHabit(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const result = await goalService.completeHabit(userId, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}