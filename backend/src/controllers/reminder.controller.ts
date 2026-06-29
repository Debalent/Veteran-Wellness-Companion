// =============================================================================
// Reminder Controller
// =============================================================================
// Handles HTTP request/response for appointment, medication, and wellness reminders.
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import * as reminderService from '../services/reminder.service.js';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const reminder = await reminderService.createReminder(userId, req.body);
    res.status(201).json(reminder);
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const includeSent = req.query.includeSent === 'true';
    const reminders = await reminderService.getReminders(userId, includeSent);
    res.json(reminders);
  } catch (error) {
    next(error);
  }
}

export async function getUpcoming(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const reminders = await reminderService.getUpcomingReminders(userId);
    res.json(reminders);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    await reminderService.deleteReminder(userId, req.params.id!);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}