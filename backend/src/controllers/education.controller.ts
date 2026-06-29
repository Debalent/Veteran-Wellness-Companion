// =============================================================================
// Education Controller
// =============================================================================
// Handles HTTP request/response for stress and resilience education content.
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import * as educationService from '../services/education.service.js';

export async function listLessons(req: Request, res: Response, next: NextFunction) {
  try {
    const lessons = await educationService.getPublishedLessons();
    res.json(lessons);
  } catch (error) {
    next(error);
  }
}

export async function getLesson(req: Request, res: Response, next: NextFunction) {
  try {
    const lesson = await educationService.getLessonById(req.params.id!);
    res.json(lesson);
  } catch (error) {
    next(error);
  }
}

export async function complete(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const result = await educationService.completeLesson(userId, req.params.id!);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

export async function getCompleted(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const completed = await educationService.getCompletedLessons(userId);
    res.json(completed);
  } catch (error) {
    next(error);
  }
}

export async function getByCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const grouped = await educationService.getLessonsByCategory();
    res.json(grouped);
  } catch (error) {
    next(error);
  }
}