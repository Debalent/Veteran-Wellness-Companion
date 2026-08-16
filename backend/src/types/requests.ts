// =============================================================================
// Request/Response DTOs
// =============================================================================
// Zod schemas for API request validation.
// Each schema corresponds to a specific API endpoint.
// =============================================================================

import { z } from 'zod';

// ─── Auth ───────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
  displayName: z.string().min(1, 'Display name is required').max(100).optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ─── Wellness Check-ins ─────────────────────────────────────────────────────

export const createCheckinSchema = z.object({
  mood: z.number().int().min(1, 'Mood must be between 1 and 10').max(10, 'Mood must be between 1 and 10'),
  sleepHours: z
    .number()
    .min(0, 'Sleep hours must be between 0 and 24')
    .max(24, 'Sleep hours must be between 0 and 24')
    .optional(),
  stressLevel: z
    .number()
    .int()
    .min(1, 'Stress level must be between 1 and 10')
    .max(10, 'Stress level must be between 1 and 10')
    .optional(),
  notes: z.string().max(1000, 'Notes must be at most 1000 characters').optional(),
});

export const checkinQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

// ─── Goals ──────────────────────────────────────────────────────────────────

export const createGoalSchema = z.object({
  title: z.string().min(1, 'Goal title is required').max(200),
  description: z.string().max(1000).optional(),
  category: z.enum([
    'NUTRITION', 'SLEEP', 'EXERCISE', 'FINANCIAL',
    'SOCIAL', 'MINDFULNESS', 'STRESS_MANAGEMENT', 'GENERAL_WELLNESS',
  ]),
  targetDate: z.string().datetime().optional(),
});

export const updateGoalSchema = createGoalSchema.partial().extend({
  progress: z.number().int().min(0).max(100).optional(),
  isActive: z.boolean().optional(),
});

// ─── Habits ─────────────────────────────────────────────────────────────────

export const createHabitSchema = z.object({
  name: z.string().min(1, 'Habit name is required').max(200),
  frequency: z.enum(['DAILY', 'WEEKLY', 'MONTHLY']),
});

export const completeHabitSchema = z.object({
  habitId: z.string().uuid(),
  date: z.string().datetime(),
  notes: z.string().max(500).optional(),
});

// ─── Reminders ──────────────────────────────────────────────────────────────

export const createReminderSchema = z.object({
  title: z.string().min(1, 'Reminder title is required').max(200),
  description: z.string().max(500).optional(),
  type: z.enum(['APPOINTMENT', 'MEDICATION', 'WELLNESS_CHECKIN', 'GOAL_CHECKIN', 'GENERAL']),
  scheduledAt: z.string().datetime(),
  repeat: z.enum(['DAILY', 'WEEKLY', 'BIWEEKLY', 'MONTHLY']).optional(),
});

// ─── Safety Plans ───────────────────────────────────────────────────────────

export const createSafetyPlanSchema = z.object({
  warningSigns: z.array(z.string().min(1)).min(1, 'At least one warning sign is required'),
  copingStrategies: z.array(z.string().min(1)).min(1, 'At least one coping strategy is required'),
  supportContacts: z.array(z.string().min(1)).min(1, 'At least one support contact is required'),
  professionalContact: z.string().max(200).optional(),
  crisisLineConsent: z.boolean().default(true),
});

// Explicit, per-request consent is required to transmit PHI to the VA Lighthouse API.
export const syncSafetyPlanToVASchema = z.object({
  vaPatientId: z.string().min(1, 'VA patient identifier (ICN) is required'),
  consent: z.boolean().refine((v) => v === true, {
    message: 'Explicit consent is required to sync data to the VA',
  }),
});

// ─── Trip Assistance ("My Trips") ───────────────────────────────────────────

export const createSavedTripSchema = z.object({
  label: z.string().min(1, 'A trip label is required').max(100),
  origin: z.string().min(1, 'Origin is required').max(300),
  destination: z.string().min(1, 'Destination is required').max(300),
  notes: z.string().max(1000).optional(),
  isHome: z.boolean().default(false),
});

export const updateSavedTripSchema = createSavedTripSchema.partial();

// ─── API Response Types (not Zod, just TypeScript) ──────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}