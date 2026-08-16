// =============================================================================
// VA Lighthouse API Client
// =============================================================================
// OAuth2 client-credentials wrapper for calling VA Lighthouse FHIR endpoints.
// Disabled by default — only activates when LIGHTHOUSE_* env vars are set,
// so this integration can ship without blocking environments that don't need it.
// =============================================================================

import { env } from '../../config/environment.js';
import { logger } from '../../utils/logger.js';

interface AccessToken {
  token: string;
  expiresAt: number; // epoch ms
}

let cachedToken: AccessToken | null = null;

export function isLighthouseConfigured(): boolean {
  return Boolean(
    env.LIGHTHOUSE_API_BASE_URL && env.LIGHTHOUSE_TOKEN_URL &&
    env.LIGHTHOUSE_CLIENT_ID && env.LIGHTHOUSE_CLIENT_SECRET
  );
}

async function getAccessToken(): Promise<string> {
  if (!isLighthouseConfigured()) {
    throw new Error('VA Lighthouse integration is not configured (missing LIGHTHOUSE_* env vars)');
  }
  if (cachedToken && cachedToken.expiresAt > Date.now()) {
    return cachedToken.token;
  }

  const response = await fetch(env.LIGHTHOUSE_TOKEN_URL!, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: env.LIGHTHOUSE_CLIENT_ID!,
      client_secret: env.LIGHTHOUSE_CLIENT_SECRET!,
      scope: 'launch/patient patient/CarePlan.read patient/Observation.write',
    }),
  });

  if (!response.ok) {
    throw new Error(`VA Lighthouse token request failed: ${response.status}`);
  }

  const body = (await response.json()) as { access_token: string; expires_in: number };
  cachedToken = {
    token: body.access_token,
    expiresAt: Date.now() + body.expires_in * 1000 - 30_000, // refresh 30s early
  };
  return cachedToken.token;
}

/**
 * Send a FHIR resource to a VA Lighthouse endpoint (e.g., "CarePlan", "Observation").
 * Requests are made over TLS 1.3 to the configured Lighthouse base URL.
 */
export async function submitFhirResource<T extends { resourceType: string }>(
  resourcePath: string,
  resource: T
): Promise<unknown> {
  const token = await getAccessToken();

  const response = await fetch(`${env.LIGHTHOUSE_API_BASE_URL}/${resourcePath}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/fhir+json',
    },
    body: JSON.stringify(resource),
  });

  if (!response.ok) {
    logger.error('VA Lighthouse FHIR submission failed', {
      resourcePath,
      status: response.status,
      eventType: 'LIGHTHOUSE_SUBMIT',
      result: 'failure',
    });
    throw new Error(`VA Lighthouse submission failed: ${response.status}`);
  }

  logger.info('VA Lighthouse FHIR resource submitted', {
    resourcePath,
    eventType: 'LIGHTHOUSE_SUBMIT',
    result: 'success',
  });
  return response.json();
}
