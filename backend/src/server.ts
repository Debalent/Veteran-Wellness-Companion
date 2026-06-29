// =============================================================================
// Veteran Wellness Companion — Backend Server
// =============================================================================
// Entry point for the Express API server.
// Initializes middleware, routes, and database connection.
// =============================================================================

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { env } from './config/environment.js';
import { corsOptions } from './config/cors.js';
import { connectDatabase } from './config/database.js';
import { apiLimiter } from './middleware/rateLimiter.middleware.js';
import { errorHandler } from './middleware/errorHandler.middleware.js';
import { logger } from './utils/logger.js';
import routes from './routes/index.js';

const app = express();

// ─── Security Middleware ─────────────────────────────────────────────────────
app.use(helmet());
app.use(cors(corsOptions));

// ─── Body Parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Rate Limiting ──────────────────────────────────────────────────────────
app.use('/api/', apiLimiter);

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── API Routes ─────────────────────────────────────────────────────────────
app.use('/api/v1', routes);

// ─── Error Handling ─────────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Server Startup ─────────────────────────────────────────────────────────
async function start() {
  try {
    await connectDatabase();
    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT} in ${env.NODE_ENV} mode`);
      logger.info(`Health check: http://localhost:${env.PORT}/health`);
      logger.info(`API v1: http://localhost:${env.PORT}/api/v1`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

start();

export default app;