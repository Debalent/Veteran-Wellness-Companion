// =============================================================================
// Wellness Check-in Service
// =============================================================================
// Manages daily wellness check-ins for veterans.
// This is the core self-monitoring feature of the platform.
// Data is used for personal trend viewing only — never for diagnosis.
// =============================================================================

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { logger } from '../utils/logger.js';

/**
 * Create a new wellness check-in for a user.
 */
export async function createCheckin(
  userId: string,
  data: {
    mood: number;
    sleepHours?: number;
    stressLevel?: number;
    notes?: string;
  }
) {
  const checkin = await prisma.wellnessCheckin.create({
    data: {
      userId,
      mood: data.mood,
      sleepHours: data.sleepHours,
      stressLevel: data.stressLevel,
      notes: data.notes,
    },
  });

  logger.info('Wellness check-in created', { userId, checkinId: checkin.id });
  return checkin;
}

/**
 * Get a user's check-in history with pagination and date filtering.
 */
export async function getCheckins(
  userId: string,
  options: {
    from?: string;
    to?: string;
    page: number;
    limit: number;
  }
) {
  const where: any = { userId };

  if (options.from || options.to) {
    where.createdAt = {};
    if (options.from) where.createdAt.gte = new Date(options.from);
    if (options.to) where.createdAt.lte = new Date(options.to);
  }

  const [data, total] = await Promise.all([
    prisma.wellnessCheckin.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (options.page - 1) * options.limit,
      take: options.limit,
    }),
    prisma.wellnessCheckin.count({ where }),
  ]);

  return {
    data,
    pagination: {
      page: options.page,
      limit: options.limit,
      total,
      totalPages: Math.ceil(total / options.limit),
    },
  };
}

/**
 * Get a single check-in by ID.
 * Verifies the check-in belongs to the requesting user.
 */
export async function getCheckinById(userId: string, checkinId: string) {
  const checkin = await prisma.wellnessCheckin.findUnique({
    where: { id: checkinId },
  });

  if (!checkin) {
    throw new AppError(404, 'Check-in not found');
  }

  if (checkin.userId !== userId) {
    throw new AppError(403, 'You do not have permission to view this check-in');
  }

  return checkin;
}

/**
 * Get recent wellness trends for a user (last 30 days).
 * Used for displaying trend charts on the dashboard.
 */
export async function getRecentTrends(userId: string) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const checkins = await prisma.wellnessCheckin.findMany({
    where: {
      userId,
      createdAt: { gte: thirtyDaysAgo },
    },
    orderBy: { createdAt: 'asc' },
    select: {
      mood: true,
      sleepHours: true,
      stressLevel: true,
      createdAt: true,
    },
  });

  return checkins;
}