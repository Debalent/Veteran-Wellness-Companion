// =============================================================================
// CORS Configuration
// =============================================================================
// Configures Cross-Origin Resource Sharing for the API.
// In production, this should be restricted to known frontend origins.
// =============================================================================

import { CorsOptions } from 'cors';
import { env } from './environment.js';

/**
 * CORS options for Express.
 * In development, allows the Vite dev server origin.
 * In production, should be restricted to the deployed frontend URL.
 */
export const corsOptions: CorsOptions = {
  origin: env.NODE_ENV === 'production'
    ? [env.FRONTEND_URL]  // Only allow the production frontend
    : ['http://localhost:5173', 'http://localhost:3000'],  // Dev origins
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,  // Cache preflight for 24 hours
};