// =============================================================================
// Trip Assistance Controller
// =============================================================================
// Handles HTTP request/response for the "My Trips" mobility feature.
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import * as tripAssistanceService from '../services/tripAssistance.service.js';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const trip = await tripAssistanceService.createSavedTrip(userId, req.body);
    res.status(201).json(trip);
  } catch (error) {
    next(error);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const trips = await tripAssistanceService.listSavedTrips(userId);
    res.json(trips);
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const trip = await tripAssistanceService.updateSavedTrip(userId, req.params.tripId!, req.body);
    res.json(trip);
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    await tripAssistanceService.deleteSavedTrip(userId, req.params.tripId!);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

export async function requestAssistance(req: Request, res: Response, next: NextFunction) {
  try {
    const userId = req.user!.userId;
    const trip = await tripAssistanceService.requestTripAssistance(userId, req.params.tripId!);
    res.json(trip);
  } catch (error) {
    next(error);
  }
}
