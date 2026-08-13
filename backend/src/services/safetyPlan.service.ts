// =============================================================================
// Safety Plan Service
// =============================================================================
// Manages personalized safety plans for veterans.
// Based on the VA Safety Plan framework — a self-directed tool
// that helps veterans identify warning signs, coping strategies,
// and support contacts. This is NOT a clinical assessment tool.
// Crisis line access is always prominently available.
// =============================================================================

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { logger } from '../utils/logger.js';

/**
 * Create or update a safety plan for a user.
 * Each user can have only one active safety plan at a time.
 */
export async function upsertSafetyPlan(
  userId: string,
  data: {
    warningSigns: string[];
    copingStrategies: string[];
    supportContacts: string[];
    professionalContact?: string;
    crisisLineConsent?: boolean;
  }
) {
  // Check if user already has a safety plan
  const existing = await prisma.safetyPlan.findFirst({
    where: { userId, isActive: true },
  });

  if (existing) {
    // Update existing plan
    const updated = await prisma.safetyPlan.update({
      where: { id: existing.id },
      data: {
        warningSigns: data.warningSigns,
        copingStrategies: data.copingStrategies,
        supportContacts: data.supportContacts,
        professionalContact: data.professionalContact,
        crisisLineConsent: data.crisisLineConsent ?? true,
      },
    });

    logger.info('Safety plan updated', {\n    userId,\n    planId: updated.id,\n    eventType: 'SAFETY_PLAN_WRITE',\n    action: 'UPDATE',\n    result: 'success',\n    resourceType: 'SafetyPlan',\n  });
    return updated;
  }

  // Create new safety plan
  const plan = await prisma.safetyPlan.create({
    data: {
      userId,
      warningSigns: data.warningSigns,
      copingStrategies: data.copingStrategies,
      supportContacts: data.supportContacts,
      professionalContact: data.professionalContact,
      crisisLineConsent: data.crisisLineConsent ?? true,
    },
  });

  logger.info('Safety plan created', {\n    userId,\n    planId: plan.id,\n    eventType: 'SAFETY_PLAN_WRITE',\n    action: 'CREATE',\n    result: 'success',\n    resourceType: 'SafetyPlan',\n  });
  return plan;
}

/**
 * Get the active safety plan for a user.
 */
export async function getSafetyPlan(userId: string) {
  const plan = await prisma.safetyPlan.findFirst({
    where: { userId, isActive: true },
  });

  return plan; // Returns null if no plan exists (not an error)
}

/**
 * Deactivate a safety plan.
 */
export async function deactivateSafetyPlan(userId: string) {
  const plan = await prisma.safetyPlan.findFirst({
    where: { userId, isActive: true },
  });

  if (!plan) {
    throw new AppError(404, 'No active safety plan found');
  }

  const updated = await prisma.safetyPlan.update({
    where: { id: plan.id },
    data: { isActive: false },
  });

  logger.info('Safety plan deactivated', {\n    userId,\n    planId: plan.id,\n    eventType: 'SAFETY_PLAN_WRITE',\n    action: 'DEACTIVATE',\n    result: 'success',\n    resourceType: 'SafetyPlan',\n  });
  return updated;
}