// =============================================================================
// Education Service
// =============================================================================
// Manages stress and resilience education content for veterans.
// All lessons are evidence-based and grounded in VA best practices.
// Tracks which lessons a user has completed.
// =============================================================================

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { logger } from '../utils/logger.js';

/**
 * Get all published education lessons, ordered by their display order.
 */
export async function getPublishedLessons() {
  const lessons = await prisma.educationLesson.findMany({
    where: { isPublished: true },
    orderBy: { orderIndex: 'asc' },
    select: {
      id: true,
      title: true,
      summary: true,
      category: true,
      duration: true,
      orderIndex: true,
      createdAt: true,
    },
  });

  return lessons;
}

/**
 * Get a single lesson by ID with full content.
 */
export async function getLessonById(lessonId: string) {
  const lesson = await prisma.educationLesson.findUnique({
    where: { id: lessonId },
  });

  if (!lesson) {
    throw new AppError(404, 'Lesson not found');
  }

  return lesson;
}

/**
 * Mark a lesson as completed by a user.
 */
export async function completeLesson(userId: string, lessonId: string) {
  // Verify the lesson exists
  const lesson = await prisma.educationLesson.findUnique({
    where: { id: lessonId },
  });

  if (!lesson) {
    throw new AppError(404, 'Lesson not found');
  }

  // Create completion record (unique constraint prevents duplicates)
  const completed = await prisma.completedLesson.create({
    data: { userId, lessonId },
  });

  logger.info('Lesson completed', { userId, lessonId });
  return completed;
}

/**
 * Get all lessons completed by a user.
 */
export async function getCompletedLessons(userId: string) {
  const completed = await prisma.completedLesson.findMany({
    where: { userId },
    include: {
      lesson: {
        select: {
          id: true,
          title: true,
          summary: true,
          category: true,
          duration: true,
        },
      },
    },
    orderBy: { completedAt: 'desc' },
  });

  return completed;
}

/**
 * Get lessons grouped by category for the resilience library.
 */
export async function getLessonsByCategory() {
  const lessons = await prisma.educationLesson.findMany({
    where: { isPublished: true },
    orderBy: [{ category: 'asc' }, { orderIndex: 'asc' }],
    select: {
      id: true,
      title: true,
      summary: true,
      category: true,
      duration: true,
      orderIndex: true,
    },
  });

  // Group by category
  const grouped: Record<string, typeof lessons> = {};
  for (const lesson of lessons) {
    const category = lesson.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category]!.push(lesson);
  }

  return grouped;
}