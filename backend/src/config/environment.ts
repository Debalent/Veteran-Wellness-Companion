// =============================================================================
// Environment Configuration
// =============================================================================
// Validates and exports all environment variables used by the backend.
// This ensures the application fails fast if required config is missing.
// =============================================================================

import { z } from 'zod';

/**
 * Schema for validating environment variables at startup.
 * All required variables must be present or the server will refuse to start.
 */
const envSchema = z.object({
  // Application
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3001),
  FRONTEND_URL: z.string().url().default('http://localhost:5173'),

  // Database
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // Authentication
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  // Bcrypt
  BCRYPT_SALT_ROUNDS: z.coerce.number().min(10).max(15).default(12),

  // Field-level encryption (AES-256-GCM) for PHI/PII at rest, e.g. Safety Plan contents.
  // Must be a 64-character hex string (32 bytes). Generate with:
  //   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  ENCRYPTION_KEY: z
    .string()
    .regex(/^[0-9a-fA-F]{64}$/, 'ENCRYPTION_KEY must be a 64-character hex string (32 bytes)'),

  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().default(100),

  // Logging
  LOG_LEVEL: z.enum(['trace', 'debug', 'info', 'warn', 'error', 'fatal']).default('info'),

  // Crisis Resources
  VETERANS_CRISIS_LINE: z.string().default('988'),
  CRISIS_TEXT_LINE: z.string().default('838255'),

  // VA Lighthouse API (HL7 FHIR) — optional until the integration is enabled.
  LIGHTHOUSE_API_BASE_URL: z.string().url().optional(),
  LIGHTHOUSE_TOKEN_URL: z.string().url().optional(),
  LIGHTHOUSE_CLIENT_ID: z.string().optional(),
  LIGHTHOUSE_CLIENT_SECRET: z.string().optional(),
});

/**
 * Parsed and validated environment configuration.
 * Access application config through this object, not process.env directly.
 */
export const env = envSchema.parse(process.env);

export type Env = z.infer<typeof envSchema>;