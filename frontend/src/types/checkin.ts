// =============================================================================
// Wellness Check-in Types
// =============================================================================

export interface WellnessCheckin {
  id: string;
  userId: string;
  mood: number;
  sleepHours?: number;
  stressLevel?: number;
  notes?: string;
  createdAt: string;
}

export interface CreateCheckinRequest {
  mood: number;
  sleepHours?: number;
  stressLevel?: number;
  notes?: string;
}

export interface CheckinTrend {
  mood: number;
  sleepHours?: number;
  stressLevel?: number;
  createdAt: string;
}

export interface WellnessSummary {
  avgMood: number | null;
  avgSleep: number | null;
  avgStress: number | null;
  activeGoals: number;
  checkinStreak: number;
  totalCheckins: number;
}