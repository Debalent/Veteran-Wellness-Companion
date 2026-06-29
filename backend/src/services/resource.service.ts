// =============================================================================
// Wellness Resource Service
// =============================================================================
// Manages the curated wellness resource library covering nutrition, sleep,
// exercise, financial wellness, and other wellness dimensions.
// All resources are reviewed for clinical accuracy.
// =============================================================================

import { prisma } from '../config/database.js';

/**
 * Get all published wellness resources, optionally filtered by category.
 */
export async function getResources(category?: string) {
  const where: any = { isPublished: true };
  if (category) {
    where.category = category;
  }

  const resources = await prisma.wellnessResource.findMany({
    where,
    orderBy: [{ category: 'asc' }, { title: 'asc' }],
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      url: true,
      createdAt: true,
    },
  });

  return resources;
}

/**
 * Get a single resource by ID.
 */
export async function getResourceById(resourceId: string) {
  const resource = await prisma.wellnessResource.findUnique({
    where: { id: resourceId },
  });

  return resource;
}

/**
 * Get resources grouped by category for the resource library.
 */
export async function getResourcesByCategory() {
  const resources = await prisma.wellnessResource.findMany({
    where: { isPublished: true },
    orderBy: [{ category: 'asc' }, { title: 'asc' }],
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      url: true,
    },
  });

  const grouped: Record<string, typeof resources> = {};
  for (const resource of resources) {
    const category = resource.category;
    if (!grouped[category]) {
      grouped[category] = [];
    }
    grouped[category]!.push(resource);
  }

  return grouped;
}

/**
 * Get crisis support resources specifically.
 * These are always available and prominently displayed.
 */
export async function getCrisisResources() {
  const resources = await prisma.wellnessResource.findMany({
    where: {
      isPublished: true,
      category: 'CRISIS_SUPPORT',
    },
    orderBy: { title: 'asc' },
  });

  return resources;
}