// =============================================================================
// Wellness Check-in Controller
// =============================================================================
// Handles HTTP request/response for wellness check-in endpoints.
// Veterans use these endpoints to log daily mood, sleep, and stress.
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import * as checkinService from '../services/checkin.service.js';

/**
 * POST /api/v1/checkins
 * Create a new wellness check-in.
 */
export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const checkin = await checkinService.createCheckin(userId, req.body);
    res.status(201).json(checkin);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/checkins
 * Get paginated check-in history for the authenticated user.
 */
export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const { from, to, page, limit } = req.query as any;
    const result = await checkinService.getCheckins(userId, {
      from,
      to,
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
    });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/checkins/trends
 * Get recent wellness trends for the dashboard.
 */
export async function trends(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const trends = await checkinService.getRecentTrends(userId);
    res.json(trends);
  } catch (error) {
    next(error);
  }
}

/**
 * GET /api/v1/checkins/:id
 * Get a single check-in by ID.
 */
export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const checkin = await checkinService.getCheckinById(userId, req.params.id!);
    res.json(checkin);
  } catch (error) {
    next(error);
  }
}