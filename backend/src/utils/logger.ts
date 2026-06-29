// =============================================================================
// Structured Logger
// =============================================================================
// Provides a structured logging interface using Pino.
// Log levels are configurable via environment variables.
// No PII should ever be passed to the logger.
// =============================================================================

import pino from 'pino';
import { env } from '../config/environment.js';

/**
 * Application-wide logger instance.
 *
 * Usage:
 *   logger.info('User authenticated', { userId: user.id });
 *   logger.error('Failed to create checkin', { error: err.message });
 *
 * Security: NEVER log passwords, tokens, or personal health information.
 */
export const logger = pino({
  level: env.LOG_LEVEL,
  transport: env.NODE_ENV === 'development'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      }
    : undefined,
  redact: {
    paths: ['req.headers.authorization', 'req.headers.cookie', 'password', 'passwordHash'],
    censor: '[REDACTED]',
  },
});