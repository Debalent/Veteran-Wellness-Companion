// =============================================================================
// Goal & Habit Types
// =============================================================================

export interface Goal {
  id: string;
  userId: string;
  title: string;
  description?: string;
  category: GoalCategory;
  targetDate?: string;
  progress: number;
  isActive: boolean;
  createdAt: string;
  habits: Habit[];
}

export type GoalCategory =
  | 'NUTRITION'
  | 'SLEEP'
  | 'EXERCISE'
  | 'FINANCIAL'
  | 'SOCIAL'
  | 'MINDFULNESS'
  | 'STRESS_MANAGEMENT'
  | 'GENERAL_WELLNESS';

export interface Habit {
  id: string;
  goalId: string;
  name: string;
  frequency: Frequency;
  streak: number;
}

export type Frequency = 'DAILY' | 'WEEKLY' | 'MONTHLY';

export interface CreateGoalRequest {
  title: string;
  description?: string;
  category: GoalCategory;
  targetDate?: string;
}

export interface CreateHabitRequest {
  name: string;
  frequency: Frequency;
}