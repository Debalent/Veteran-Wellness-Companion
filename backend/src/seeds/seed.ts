// =============================================================================
// Database Seeder
// =============================================================================
// Seeds the database with initial educational content and wellness resources.
// Run with: npm run db:seed
// =============================================================================

import { prisma } from '../config/database.js';
import { educationLessons } from './data/educationLessons.js';
import { wellnessResources } from './data/wellnessResources.js';

async function seed() {
  console.log('🌱 Starting database seed...');

  // ─── Education Lessons ─────────────────────────────────────────────────────
  console.log('Seeding education lessons...');
  for (const lesson of educationLessons) {
    await prisma.educationLesson.upsert({
      where: { id: lesson.title }, // This won't work directly, so we use findFirst + create
      update: lesson,
      create: lesson,
    });
  }
  console.log(`  ✓ ${educationLessons.length} lessons seeded`);

  // ─── Wellness Resources ────────────────────────────────────────────────────
  console.log('Seeding wellness resources...');
  for (const resource of wellnessResources) {
    const existing = await prisma.wellnessResource.findFirst({
      where: { title: resource.title },
    });

    if (!existing) {
      await prisma.wellnessResource.create({ data: resource });
    }
  }
  console.log(`  ✓ ${wellnessResources.length} resources seeded`);

  console.log('✅ Database seeding complete!');
}

seed()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });