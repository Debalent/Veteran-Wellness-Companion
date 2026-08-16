// =============================================================================
// Field-Level Encryption Utility
// =============================================================================
// Provides AES-256-GCM encryption for PHI/PII fields stored at rest
// (e.g., Safety Plan warning signs, support contacts, professional contacts).
// Transport is separately secured via TLS 1.3 at the load balancer/proxy.
// =============================================================================

import crypto from 'crypto';
import { env } from '../config/environment.js';

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH_BYTES = 12; // NIST-recommended IV length for GCM
const KEY_LENGTH_BYTES = 32; // 256-bit key

function getKey(): Buffer {
  const key = Buffer.from(env.ENCRYPTION_KEY, 'hex');
  if (key.length !== KEY_LENGTH_BYTES) {
    throw new Error(
      `ENCRYPTION_KEY must be a ${KEY_LENGTH_BYTES}-byte (${KEY_LENGTH_BYTES * 2}-char hex) value for AES-256`
    );
  }
  return key;
}

/**
 * Encrypt a single plaintext string field using AES-256-GCM.
 * Output format: `<iv>:<authTag>:<ciphertext>` (all hex-encoded).
 */
export function encryptField(plaintext: string): string {
  const iv = crypto.randomBytes(IV_LENGTH_BYTES);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString('hex'), authTag.toString('hex'), encrypted.toString('hex')].join(':');
}

/** Decrypt a field produced by {@link encryptField}. */
export function decryptField(ciphertext: string): string {
  const [ivHex, authTagHex, dataHex] = ciphertext.split(':');
  if (!ivHex || !authTagHex || !dataHex) {
    throw new Error('Invalid encrypted field format');
  }
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataHex, 'hex')),
    decipher.final(),
  ]);
  return decrypted.toString('utf8');
}

export function encryptArray(values: string[]): string[] {
  return values.map(encryptField);
}

/**
 * Decrypt an array of fields. Falls back to the raw value for any entry
 * that isn't in encrypted format, so pre-existing plaintext rows (created
 * before encryption was introduced) remain readable during migration.
 */
export function decryptArray(values: string[]): string[] {
  return values.map((value) => {
    try {
      return decryptField(value);
    } catch {
      return value;
    }
  });
}

export function decryptOptionalField(value: string | null | undefined): string | null | undefined {
  if (!value) return value;
  try {
    return decryptField(value);
  } catch {
    return value;
  }
}
