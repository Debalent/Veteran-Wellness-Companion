// =============================================================================
// Goal & Habit Tracking Service
// =============================================================================
// Manages wellness goals and associated habits for veterans.
// Goals span multiple wellness dimensions (nutrition, sleep, exercise, etc.).
// Habits are specific actions that build toward larger goals.
// =============================================================================

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { logger } from '../utils/logger.js';

/**
 * Create a new wellness goal for a user.
 */
export async function createGoal(
  userId: string,
  data: {
    title: string;
    description?: string;
    category: string;
    targetDate?: string;
  }
) {
  const goal = await prisma.goal.create({
    data: {
      userId,
      title: data.title,
      description: data.description,
      category: data.category as any,
      targetDate: data.targetDate ? new Date(data.targetDate) : null,
    },
  });

  logger.info('Goal created', { userId, goalId: goal.id });
  return goal;
}

/**
 * Get all active goals for a user.
 */
export async function getGoals(userId: string, includeInactive = false) {
  const where: any = { userId };
  if (!includeInactive) {
    where.isActive = true;
  }

  const goals = await prisma.goal.findMany({
    where,
    include: { habits: true },
    orderBy: { createdAt: 'desc' },
  });

  return goals;
}

/**
 * Update a goal (progress, title, category, etc.).
 */
export async function updateGoal(
  userId: string,
  goalId: string,
  data: {
    title?: string;
    description?: string;
    category?: string;
    targetDate?: string;
    progress?: number;
    isActive?: boolean;
  }
) {
  const goal = await prisma.goal.findUnique({ where: { id: goalId } });

  if (!goal) throw new AppError(404, 'Goal not found');
  if (goal.userId !== userId) throw new AppError(403, 'Not authorized to update this goal');

  const updated = await prisma.goal.update({
    where: { id: goalId },
    data: {
      ...(data.title && { title: data.title }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.category && { category: data.category as any }),
      ...(data.targetDate && { targetDate: new Date(data.targetDate) }),
      ...(data.progress !== undefined && { progress: data.progress }),
      ...(data.isActive !== undefined && { isActive: data.isActive }),
    },
    include: { habits: true },
  });

  return updated;
}

/**
 * Delete a goal and its associated habits.
 */
export async function deleteGoal(userId: string, goalId: string) {
  const goal = await prisma.goal.findUnique({ where: { id: goalId } });

  if (!goal) throw new AppError(404, 'Goal not found');
  if (goal.userId !== userId) throw new AppError(403, 'Not authorized to delete this goal');

  await prisma.goal.delete({ where: { id: goalId } });
  logger.info('Goal deleted', { userId, goalId });
}

// ─── Habits ─────────────────────────────────────────────────────────────────

/**
 * Add a habit to a goal.
 */
export async function createHabit(
  userId: string,
  goalId: string,
  data: { name: string; frequency: string }
) {
  const goal = await prisma.goal.findUnique({ where: { id: goalId } });

  if (!goal) throw new AppError(404, 'Goal not found');
  if (goal.userId !== userId) throw new AppError(403, 'Not authorized');

  const habit = await prisma.habit.create({
    data: {
      goalId,
      name: data.name,
      frequency: data.frequency as any,
    },
  });

  return habit;
}

/**
 * Log completion of a habit for streak tracking.
 */
export async function completeHabit(
  userId: string,
  data: { habitId: string; date: string; notes?: string }
) {
  const habit = await prisma.habit.findUnique({
    where: { id: data.habitId },
    include: { goal: true },
  });

  if (!habit) throw new AppError(404, 'Habit not found');
  if (habit.goal.userId !== userId) throw new AppError(403, 'Not authorized');

  // Log the completion
  const log = await prisma.progressLog.create({
    data: {
      userId,
      habitId: data.habitId,
      date: new Date(data.date),
      notes: data.notes,
    },
  });

  // Update streak
  const updatedHabit = await prisma.habit.update({
    where: { id: data.habitId },
    data: { streak: { increment: 1 } },
  });

  return { log, streak: updatedHabit.streak };
}