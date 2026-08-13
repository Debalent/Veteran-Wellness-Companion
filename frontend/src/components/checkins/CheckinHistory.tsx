// =============================================================================
// Check-in History
// =============================================================================
// Displays a list of past wellness check-ins with mood, sleep, and stress data.
// =============================================================================

import { useEffect, useState } from 'react';
import { getCheckins } from '@services/checkinService';
import type { WellnessCheckin } from '@/types/checkin';
import { format } from 'date-fns';

export default function CheckinHistory() {
  const [checkins, setCheckins] = useState<WellnessCheckin[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCheckins();
  }, []);

  const loadCheckins = async () => {
    try {
      const result = await getCheckins({ limit: 30 });
      setCheckins(result.data);
    } catch (err) {
      console.error('Failed to load check-ins:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading check-ins...</div>;

  if (checkins.length === 0) {
    return (
      <div className="checkin-history">
        <h2>Check-in History</h2>
        <p className="checkin-history__empty">
          No check-ins yet. Start your wellness journey by logging your first check-in!
        </p>
      </div>
    );
  }

  return (
    <div className="checkin-history">
      <h2>Check-in History</h2>
      <div className="checkin-history__list">
        {checkins.map((checkin) => (
          <div key={checkin.id} className="checkin-history__item">
            <div className="checkin-history__date">
              {format(new Date(checkin.createdAt), 'MMM d, yyyy h:mm a')}
            </div>
            <div className="checkin-history__metrics">
              <span className="checkin-history__metric">
                Mood: {checkin.mood}/10
              </span>
              {checkin.sleepHours && (
                <span className="checkin-history__metric">
                  Sleep: {checkin.sleepHours}h
                </span>
              )}
              {checkin.stressLevel && (
                <span className="checkin-history__metric">
                  Stress: {checkin.stressLevel}/10
                </span>
              )}
            </div>
            {checkin.notes && (
              <p className="checkin-history__notes">{checkin.notes}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}