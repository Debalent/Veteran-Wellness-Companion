// =============================================================================
// Wellness Resource Controller
// =============================================================================
// Handles HTTP request/response for the wellness resource library.
// Resources cover nutrition, sleep, exercise, financial wellness, and more.
// =============================================================================

import { Request, Response, NextFunction } from 'express';
import * as resourceService from '../services/resource.service.js';

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const category = req.query.category as string | undefined;
    const resources = await resourceService.getResources(category);
    res.json(resources);
  } catch (error) {
    next(error);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction) {
  try {
    const resource = await resourceService.getResourceById(req.params.id!);
    if (!resource) {
      res.status(404).json({ error: 'Resource not found' });
      return;
    }
    res.json(resource);
  } catch (error) {
    next(error);
  }
}

export async function getByCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const grouped = await resourceService.getResourcesByCategory();
    res.json(grouped);
  } catch (error) {
    next(error);
  }
}

export async function getCrisis(req: Request, res: Response, next: NextFunction) {
  try {
    const resources = await resourceService.getCrisisResources();
    res.json(resources);
  } catch (error) {
    next(error);
  }
}