// =============================================================================
// Reminder Service
// =============================================================================
// Manages appointment, medication, and wellness reminders for veterans.
// Reminders can be one-time or recurring (daily, weekly, etc.).
// A scheduled notification service checks for due reminders and sends alerts.
// =============================================================================

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { logger } from '../utils/logger.js';

/**
 * Create a new reminder for a user.
 */
export async function createReminder(
  userId: string,
  data: {
    title: string;
    description?: string;
    type: string;
    scheduledAt: string;
    repeat?: string;
  }
) {
  const reminder = await prisma.reminder.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      type: data.type as any,
      scheduledAt: new Date(data.scheduledAt),
      repeat: data.repeat as any || null,
    },
  });

  logger.info('Reminder created', { userId, reminderId: reminder.id });
  return reminder;
}

/**
 * Get all reminders for a user, ordered by scheduled time.
 */
export async function getReminders(userId: string, includeSent = false) {
  const where: any = { userId };
  if (!includeSent) {
    where.isSent = false;
  }

  const reminders = await prisma.reminder.findMany({
    where,
    orderBy: { scheduledAt: 'asc' },
  });

  return reminders;
}

/**
 * Get upcoming reminders (not yet sent, scheduled in the future).
 */
export async function getUpcomingReminders(userId: string) {
  const reminders = await prisma.reminder.findMany({
    where: {
      userId,
      isSent: false,
      isActive: true,
      scheduledAt: { gte: new Date() },
    },
    orderBy: { scheduledAt: 'asc' },
    take: 10,
  });

  return reminders;
}

/**
 * Mark a reminder as sent.
 */
export async function markAsSent(reminderId: string) {
  const reminder = await prisma.reminder.update({
    where: { id: reminderId },
    data: { isSent: true },
  });

  return reminder;
}

/**
 * Delete a reminder.
 */
export async function deleteReminder(userId: string, reminderId: string) {
  const reminder = await prisma.reminder.findUnique({
    where: { id: reminderId },
  });

  if (!reminder) throw new AppError(404, 'Reminder not found');
  if (reminder.userId !== userId) throw new AppError(403, 'Not authorized to delete this reminder');

  await prisma.reminder.delete({ where: { id: reminderId } });
  logger.info('Reminder deleted', { userId, reminderId });
}

/**
 * Check for due reminders that haven't been sent.
 * This is called by a scheduled job (cron) to process notifications.
 */
export async function getDueReminders() {
  const reminders = await prisma.reminder.findMany({
    where: {
      isSent: false,
      isActive: true,
      scheduledAt: { lte: new Date() },
    },
    include: {
      user: {
        select: { id: true, email: true, displayName: true },
      },
    },
  });

  return reminders;
}