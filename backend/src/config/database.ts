// =============================================================================
// Database Configuration
// =============================================================================
// Initializes and exports the Prisma client instance.
// All database access in the application goes through this client.
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { env } from './environment.js';

/**
 * Prisma client instance configured for the current environment.
 * In development, we log queries for debugging.
 * In production, we minimize logging for performance and security.
 */
export const prisma = new PrismaClient({
  log: env.NODE_ENV === 'development'
    ? ['query', 'info', 'warn', 'error']
    : ['warn', 'error'],
});

/**
 * Connect to the database and verify the connection is working.
 * Called during server startup to fail fast if the database is unreachable.
 */
export async function connectDatabase(): Promise<void> {
  try {
    await prisma.$connect();
    console.log('Database connected successfully');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }
}

/**
 * Gracefully disconnect from the database.
 * Called during server shutdown to ensure clean disconnection.
 */
export async function disconnectDatabase(): Promise<void> {
  await prisma.$disconnect();
  console.log('Database disconnected');
}