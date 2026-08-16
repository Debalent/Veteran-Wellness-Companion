// =============================================================================
// One-time migration: encrypt pre-existing plaintext Safety Plan PHI fields.
// Safe to re-run — entries already in `iv:authTag:ciphertext` format are skipped.
// Usage: npm run migrate:encrypt-safety-plans
// =============================================================================

import { prisma } from '../config/database.js';
import { encryptField } from '../utils/encryption.util.js';
import { logger } from '../utils/logger.js';

/** Matches the `iv:authTag:ciphertext` (hex:hex:hex) format produced by encryptField. */
const ENCRYPTED_FORMAT = /^[0-9a-f]{24}:[0-9a-f]{32}:[0-9a-f]+$/i;

function isEncrypted(value: string): boolean {
  return ENCRYPTED_FORMAT.test(value);
}

function encryptIfPlaintext(value: string): string {
  return isEncrypted(value) ? value : encryptField(value);
}

async function migrate() {
  const plans = await prisma.safetyPlan.findMany();
  let updatedCount = 0;

  for (const plan of plans) {
    const warningSigns = plan.warningSigns.map(encryptIfPlaintext);
    const copingStrategies = plan.copingStrategies.map(encryptIfPlaintext);
    const supportContacts = plan.supportContacts.map(encryptIfPlaintext);
    const professionalContact = plan.professionalContact
      ? encryptIfPlaintext(plan.professionalContact)
      : plan.professionalContact;

    const changed =
      JSON.stringify(warningSigns) !== JSON.stringify(plan.warningSigns) ||
      JSON.stringify(copingStrategies) !== JSON.stringify(plan.copingStrategies) ||
      JSON.stringify(supportContacts) !== JSON.stringify(plan.supportContacts) ||
      professionalContact !== plan.professionalContact;

    if (!changed) continue;

    await prisma.safetyPlan.update({
      where: { id: plan.id },
      data: { warningSigns, copingStrategies, supportContacts, professionalContact },
    });
    updatedCount++;
  }

  logger.info(`Safety plan encryption migration complete`, {
    totalPlans: plans.length,
    updatedCount,
  });
}

migrate()
  .catch((error) => {
    logger.error('Safety plan encryption migration failed', { error });
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
