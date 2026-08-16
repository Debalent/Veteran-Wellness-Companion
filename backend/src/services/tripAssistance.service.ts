// =============================================================================
// Trip Assistance Service ("My Trips" — lightweight mobility feature)
// =============================================================================
// Saved destinations and a "Get Me Home" shortcut for independent travel.
// Deliberately scoped down from a full ride-coordination system: no driver
// matching or dispatch here — "request assistance" only flags the trip and
// logs an audit event for a human support contact to follow up on.
// Location fields are encrypted at rest (can reveal clinic/provider visits).
// =============================================================================

import { prisma } from '../config/database.js';
import { AppError } from '../middleware/errorHandler.middleware.js';
import { logger } from '../utils/logger.js';
import { encryptField, decryptOptionalField } from '../utils/encryption.util.js';

type SavedTripRecord = Awaited<ReturnType<typeof prisma.savedTrip.create>>;

function decryptTrip(trip: SavedTripRecord): SavedTripRecord {
  return {
    ...trip,
    origin: decryptOptionalField(trip.origin) ?? trip.origin,
    destination: decryptOptionalField(trip.destination) ?? trip.destination,
    notes: decryptOptionalField(trip.notes) ?? null,
  };
}

interface SavedTripInput {
  label: string;
  origin: string;
  destination: string;
  notes?: string;
  isHome?: boolean;
}

export async function createSavedTrip(userId: string, data: SavedTripInput) {
  // Only one trip can be marked as "home" — used by the "Get Me Home" shortcut.
  if (data.isHome) {
    await prisma.savedTrip.updateMany({
      where: { userId, isHome: true },
      data: { isHome: false },
    });
  }

  const trip = await prisma.savedTrip.create({
    data: {
      userId,
      label: data.label,
      origin: encryptField(data.origin),
      destination: encryptField(data.destination),
      notes: data.notes ? encryptField(data.notes) : undefined,
      isHome: data.isHome ?? false,
    },
  });

  logger.info('Saved trip created', {
    userId,
    tripId: trip.id,
    eventType: 'TRIP_WRITE',
    action: 'CREATE',
    result: 'success',
    resourceType: 'SavedTrip',
  });
  return decryptTrip(trip);
}

export async function listSavedTrips(userId: string) {
  const trips = await prisma.savedTrip.findMany({
    where: { userId },
    orderBy: [{ isHome: 'desc' }, { createdAt: 'desc' }],
  });
  return trips.map(decryptTrip);
}

export async function updateSavedTrip(userId: string, tripId: string, data: Partial<SavedTripInput>) {
  const existing = await prisma.savedTrip.findFirst({ where: { id: tripId, userId } });
  if (!existing) {
    throw new AppError(404, 'Saved trip not found');
  }

  if (data.isHome) {
    await prisma.savedTrip.updateMany({
      where: { userId, isHome: true, id: { not: tripId } },
      data: { isHome: false },
    });
  }

  const updated = await prisma.savedTrip.update({
    where: { id: tripId },
    data: {
      label: data.label,
      origin: data.origin ? encryptField(data.origin) : undefined,
      destination: data.destination ? encryptField(data.destination) : undefined,
      notes: data.notes !== undefined ? (data.notes ? encryptField(data.notes) : null) : undefined,
      isHome: data.isHome,
    },
  });

  logger.info('Saved trip updated', {
    userId,
    tripId: updated.id,
    eventType: 'TRIP_WRITE',
    action: 'UPDATE',
    result: 'success',
    resourceType: 'SavedTrip',
  });
  return decryptTrip(updated);
}

export async function deleteSavedTrip(userId: string, tripId: string) {
  const existing = await prisma.savedTrip.findFirst({ where: { id: tripId, userId } });
  if (!existing) {
    throw new AppError(404, 'Saved trip not found');
  }

  await prisma.savedTrip.delete({ where: { id: tripId } });

  logger.info('Saved trip deleted', {
    userId,
    tripId,
    eventType: 'TRIP_WRITE',
    action: 'DELETE',
    result: 'success',
    resourceType: 'SavedTrip',
  });
}

/**
 * Flag a trip as needing human assistance (e.g., transit disruption, needs a
 * ride). This only records the request and logs an audit event — it does not
 * dispatch a driver. Actual notification/coordination is a future integration.
 */
export async function requestTripAssistance(userId: string, tripId: string) {
  const existing = await prisma.savedTrip.findFirst({ where: { id: tripId, userId } });
  if (!existing) {
    throw new AppError(404, 'Saved trip not found');
  }

  const updated = await prisma.savedTrip.update({
    where: { id: tripId },
    data: { needsAssistance: true, assistanceRequestedAt: new Date() },
  });

  logger.info('Trip assistance requested', {
    userId,
    tripId,
    eventType: 'TRIP_ASSISTANCE_REQUEST',
    action: 'REQUEST',
    result: 'success',
    resourceType: 'SavedTrip',
  });
  return decryptTrip(updated);
}
