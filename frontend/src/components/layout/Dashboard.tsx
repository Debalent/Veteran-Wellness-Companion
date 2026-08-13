// =============================================================================
// Dashboard Component
// =============================================================================
// The main landing page showing wellness summary, quick actions, and trends.
// =============================================================================

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import type { WellnessSummary } from '@/types/checkin';

export default function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const [summary, setSummary] = useState<WellnessSummary | null>(null);

  useEffect(() => {
    // TODO: Fetch wellness summary from API
    // wellnessService.getWellnessSummary().then(setSummary);
  }, []);

  return (
    <div className="dashboard">
      <h2 className="dashboard__greeting">
        Welcome back, {user?.displayName ?? 'Veteran'}
      </h2>
      <p className="dashboard__subtitle">
        Your daily wellness companion — check in, set goals, and track your journey.
      </p>

      <div className="dashboard__cards">
        <Link to="/checkins" className="dashboard__card">
          <h3>Daily Check-in</h3>
          <p>Log your mood, sleep, and stress levels</p>
        </Link>

        <Link to="/goals" className="dashboard__card">
          <h3>Goals & Habits</h3>
          <p>Set wellness goals and track your progress</p>
        </Link>

        <Link to="/safety-plan" className="dashboard__card">
          <h3>Safety Plan</h3>
          <p>Your personal crisis safety plan</p>
        </Link>

        <Link to="/education" className="dashboard__card">
          <h3>Education</h3>
          <p>Learn about stress, resilience, and wellness</p>
        </Link>
      </div>

      {summary && (
        <div className="dashboard__summary">
          <h3>Your Wellness (Last 7 Days)</h3>
          <div className="dashboard__stats">
            <div className="stat">
              <span className="stat__value">{summary.avgMood ?? '—'}</span>
              <span className="stat__label">Avg Mood</span>
            </div>
            <div className="stat">
              <span className="stat__value">{summary.avgSleep ?? '—'}h</span>
              <span className="stat__label">Avg Sleep</span>
            </div>
            <div className="stat">
              <span className="stat__value">{summary.checkinStreak}</span>
              <span className="stat__label">Day Streak</span>
            </div>
            <div className="stat">
              <span className="stat__value">{summary.activeGoals}</span>
              <span className="stat__label">Active Goals</span>
            </div>
          </div>
        </div>
      )}

      <div className="dashboard__crisis">
        <p className="dashboard__crisis-text">
          If you're in crisis, help is available 24/7.
        </p>
        <a href="tel:988" className="dashboard__crisis-button">
          Veterans Crisis Line: Dial 988 then Press 1
        </a>
      </div>
    </div>
  );
}