// =============================================================================
// Goal Tracker
// =============================================================================
// Displays wellness goals with progress bars and habit streaks.
// Veterans can view, update progress, and manage goals.
// =============================================================================

import { useEffect, useState } from 'react';
import { getGoals, updateGoal, deleteGoal } from '@services/goalService';
import type { Goal } from '@/types/goal';

export default function GoalTracker() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGoals();
  }, []);

  const loadGoals = async () => {
    try {
      const data = await getGoals();
      setGoals(data);
    } catch (err) {
      console.error('Failed to load goals:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleProgressUpdate = async (goalId: string, progress: number) => {
    try {
      await updateGoal(goalId, { progress });
      setGoals((prev) =>
        prev.map((g) => (g.id === goalId ? { ...g, progress } : g))
      );
    } catch (err) {
      console.error('Failed to update progress:', err);
    }
  };

  const handleDelete = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    try {
      await deleteGoal(goalId);
      setGoals((prev) => prev.filter((g) => g.id !== goalId));
    } catch (err) {
      console.error('Failed to delete goal:', err);
    }
  };

  if (isLoading) return <div>Loading goals...</div>;

  return (
    <div className="goal-tracker">
      <div className="goal-tracker__header">
        <h2>My Wellness Goals</h2>
      </div>

      {goals.length === 0 ? (
        <p className="goal-tracker__empty">
          No goals yet. Set your first wellness goal to start tracking!
        </p>
      ) : (
        <div className="goal-tracker__list">
          {goals.map((goal) => (
            <div key={goal.id} className="goal-card">
              <div className="goal-card__header">
                <h3 className="goal-card__title">{goal.title}</h3>
                <span className="goal-card__category">{goal.category}</span>
              </div>

              {goal.description && (
                <p className="goal-card__description">{goal.description}</p>
              )}

              <div className="goal-card__progress">
                <div className="goal-card__progress-bar">
                  <div
                    className="goal-card__progress-fill"
                    style={{ width: `${goal.progress}%` }}
                  />
                </div>
                <span className="goal-card__progress-text">{goal.progress}%</span>
              </div>

              <div className="goal-card__actions">
                <button
                  onClick={() =>
                    handleProgressUpdate(
                      goal.id,
                      Math.min(goal.progress + 10, 100)
                    )
                  }
                  className="goal-card__button"
                >
                  +10%
                </button>
                <button
                  onClick={() => handleDelete(goal.id)}
                  className="goal-card__button goal-card__button--danger"
                >
                  Delete
                </button>
              </div>

              {goal.habits.length > 0 && (
                <div className="goal-card__habits">
                  <h4>Habits</h4>
                  {goal.habits.map((habit) => (
                    <div key={habit.id} className="habit-item">
                      <span>{habit.name}</span>
                      <span className="habit-item__streak">
                        Streak: {habit.streak} days
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}