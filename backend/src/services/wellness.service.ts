// =============================================================================
// Wellness Data Engine
// =============================================================================
// Core analytics and aggregation for wellness data.
// Provides trend calculations, summaries, and insights.
// All data is used for personal reflection only — never for diagnosis.
// =============================================================================

import { prisma } from '../config/database.js';

/**
 * Get a wellness summary for the dashboard.
 * Returns aggregate data across check-ins, goals, and habits.
 */
export async function getWellnessSummary(userId: string) {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Get recent check-ins for averages
  const recentCheckins = await prisma.wellnessCheckin.findMany({
    where: {
      userId,
      createdAt: { gte: sevenDaysAgo },
    },
  });

  // Calculate averages
  const avgMood = recentCheckins.length > 0
    ? Math.round(recentCheckins.reduce((sum, c) => sum + c.mood, 0) / recentCheckins.length * 10) / 10
    : null;

  const avgSleep = recentCheckins.length > 0
    ? Math.round(recentCheckins.reduce((sum, c) => sum + (c.sleepHours ?? 0), 0) / recentCheckins.length * 10) / 10
    : null;

  const avgStress = recentCheckins.filter(c => c.stressLevel !== null).length > 0
    ? Math.round(recentCheckins.filter(c => c.stressLevel !== null)
        .reduce((sum, c) => sum + (c.stressLevel ?? 0), 0) / recentCheckins.filter(c => c.stressLevel !== null).length * 10) / 10
    : null;

  // Get active goals count
  const activeGoals = await prisma.goal.count({
    where: { userId, isActive: true },
  });

  // Get check-in streak (consecutive days with a check-in)
  const checkinDates = await prisma.wellnessCheckin.findMany({
    where: {
      userId,
      createdAt: { gte: thirtyDaysAgo },
    },
    select: { createdAt: true },
    orderBy: { createdAt: 'desc' },
  });

  // Calculate current streak
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < checkinDates.length; i++) {
    const checkinDate = new Date(checkinDates[i]!.createdAt);
    checkinDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today.getTime() - streak * 24 * 60 * 60 * 1000);
    expectedDate.setHours(0, 0, 0, 0);

    if (checkinDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return {
    avgMood,
    avgSleep,
    avgStress,
    activeGoals,
    checkinStreak: streak,
    totalCheckins: recentCheckins.length,
  };
}

/**
 * Get wellness data grouped by week for trend charts.
 */
export async function getWeeklyTrends(userId: string) {
  const ninetyDaysAgo = new Date();
  ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

  const checkins = await prisma.wellnessCheckin.findMany({
    where: {
      userId,
      createdAt: { gte: ninetyDaysAgo },
    },
    orderBy: { createdAt: 'asc' },
  });

  // Group by week
  const weeklyData: Record<string, { moods: number[]; sleeps: number[]; stresses: number[] }> = {};

  for (const checkin of checkins) {
    const date = new Date(checkin.createdAt);
    const weekStart = new Date(date);
    weekStart.setDate(date.getDate() - date.getDay());
    const weekKey = weekStart.toISOString().split('T')[0]!;

    if (!weeklyData[weekKey]) {
      weeklyData[weekKey] = { moods: [], sleeps: [], stresses: [] };
    }

    weeklyData[weekKey]!.moods.push(checkin.mood);
    if (checkin.sleepHours) weeklyData[weekKey]!.sleeps.push(checkin.sleepHours);
    if (checkin.stressLevel) weeklyData[weekKey]!.stresses.push(checkin.stressLevel);
  }

  // Calculate weekly averages
  return Object.entries(weeklyData).map(([week, data]) => ({
    week,
    avgMood: Math.round(data.moods.reduce((a, b) => a + b, 0) / data.moods.length * 10) / 10,
    avgSleep: data.sleeps.length > 0
      ? Math.round(data.sleeps.reduce((a, b) => a + b, 0) / data.sleeps.length * 10) / 10
      : null,
    avgStress: data.stresses.length > 0
      ? Math.round(data.stresses.reduce((a, b) => a + b, 0) / data.stresses.length * 10) / 10
      : null,
    checkinCount: data.moods.length,
  }));
}