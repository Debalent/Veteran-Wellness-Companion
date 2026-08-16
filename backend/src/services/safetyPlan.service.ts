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
import {
  encryptArray,
  decryptArray,
  encryptField,
  decryptOptionalField,
} from '../utils/encryption.util.js';
import { isLighthouseConfigured, submitFhirResource, toFhirCarePlan } from '../integrations/va-lighthouse/index.js';

type SafetyPlanRecord = Awaited<ReturnType<typeof prisma.safetyPlan.create>>;

/**
 * Decrypt the PHI/PII fields of a safety plan record for API responses.
 * Warning signs, coping strategies, support contacts, and the professional
 * contact are encrypted at rest (AES-256-GCM) and must be decrypted before use.
 */
function decryptPlan(plan: SafetyPlanRecord): SafetyPlanRecord {
  return {
    ...plan,
    warningSigns: decryptArray(plan.warningSigns),
    copingStrategies: decryptArray(plan.copingStrategies),
    supportContacts: decryptArray(plan.supportContacts),
    professionalContact: decryptOptionalField(plan.professionalContact) ?? null,
  };
}

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
  // Encrypt PHI/PII fields before persisting (AES-256-GCM at rest)
  const encryptedData = {
    warningSigns: encryptArray(data.warningSigns),
    copingStrategies: encryptArray(data.copingStrategies),
    supportContacts: encryptArray(data.supportContacts),
    professionalContact: data.professionalContact ? encryptField(data.professionalContact) : undefined,
  };

  // Check if user already has a safety plan
  const existing = await prisma.safetyPlan.findFirst({
    where: { userId, isActive: true },
  });

  if (existing) {
    // Update existing plan
    const updated = await prisma.safetyPlan.update({
      where: { id: existing.id },
      data: {
        ...encryptedData,
        crisisLineConsent: data.crisisLineConsent ?? true,
      },
    });

    logger.info('Safety plan updated', {
      userId,
      planId: updated.id,
      eventType: 'SAFETY_PLAN_WRITE',
      action: 'UPDATE',
      result: 'success',
      resourceType: 'SafetyPlan',
    });
    return decryptPlan(updated);
  }

  // Create new safety plan
  const plan = await prisma.safetyPlan.create({
    data: {
      userId,
      ...encryptedData,
      crisisLineConsent: data.crisisLineConsent ?? true,
    },
  });

  logger.info('Safety plan created', {
    userId,
    planId: plan.id,
    eventType: 'SAFETY_PLAN_WRITE',
    action: 'CREATE',
    result: 'success',
    resourceType: 'SafetyPlan',
  });
  return decryptPlan(plan);
}

/**
 * Get the active safety plan for a user.
 */
export async function getSafetyPlan(userId: string) {
  const plan = await prisma.safetyPlan.findFirst({
    where: { userId, isActive: true },
  });

  return plan ? decryptPlan(plan) : null; // Returns null if no plan exists (not an error)
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

  logger.info('Safety plan deactivated', {
    userId,
    planId: plan.id,
    eventType: 'SAFETY_PLAN_WRITE',
    action: 'DEACTIVATE',
    result: 'success',
    resourceType: 'SafetyPlan',
  });
  return decryptPlan(updated);
}

/**
 * Sync the veteran's active safety plan to their VA health record via the
 * Lighthouse API (FHIR CarePlan). Requires explicit per-request consent —
 * this is a distinct PHI data flow to an external system and must never be
 * triggered implicitly.
 */
export async function syncSafetyPlanToVA(userId: string, vaPatientId: string) {
  if (!isLighthouseConfigured()) {
    throw new AppError(503, 'VA Lighthouse integration is not configured');
  }

  const plan = await prisma.safetyPlan.findFirst({
    where: { userId, isActive: true },
  });

  if (!plan) {
    throw new AppError(404, 'No active safety plan found to sync');
  }

  logger.info('VA sync consent recorded', {
    userId,
    planId: plan.id,
    eventType: 'VA_SYNC_CONSENT',
    result: 'success',
    resourceType: 'SafetyPlan',
  });

  const decrypted = decryptPlan(plan);
  const carePlan = toFhirCarePlan(decrypted, vaPatientId);

  try {
    await submitFhirResource('CarePlan', carePlan);
  } catch (error) {
    logger.error('VA sync failed', {
      userId,
      planId: plan.id,
      eventType: 'VA_SYNC',
      result: 'failure',
      resourceType: 'SafetyPlan',
    });
    throw new AppError(502, 'Failed to sync safety plan to the VA');
  }

  logger.info('VA sync succeeded', {
    userId,
    planId: plan.id,
    eventType: 'VA_SYNC',
    result: 'success',
    resourceType: 'SafetyPlan',
  });

  return { synced: true, planId: plan.id };
}