// =============================================================================
// Mood Check-in Form
// =============================================================================
// Daily wellness check-in form where veterans log mood, sleep, and stress.
// =============================================================================

import { useState, FormEvent } from 'react';
import { createCheckin } from '@services/checkinService';

interface Props {
  onSuccess?: () => void;
}

export default function MoodCheckinForm({ onSuccess }: Props) {
  const [mood, setMood] = useState<number>(5);
  const [sleepHours, setSleepHours] = useState<string>('');
  const [stressLevel, setStressLevel] = useState<number>(5);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await createCheckin({
        mood,
        sleepHours: sleepHours ? parseFloat(sleepHours) : undefined,
        stressLevel,
        notes: notes || undefined,
      });
      onSuccess?.();
      setMood(5);
      setSleepHours('');
      setStressLevel(5);
      setNotes('');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to save check-in.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="checkin-form">
      <h2 className="checkin-form__title">How are you feeling today?</h2>

      {error && <div className="checkin-form__error">{error}</div>}

      <div className="checkin-form__field">
        <label>Mood (1 = Very Low, 10 = Very High)</label>
        <div className="checkin-form__range">
          <input
            type="range"
            min={1}
            max={10}
            value={mood}
            onChange={(e) => setMood(parseInt(e.target.value))}
            className="checkin-form__slider"
          />
          <span className="checkin-form__value">{mood}</span>
        </div>
      </div>

      <div className="checkin-form__field">
        <label htmlFor="sleepHours">Sleep (hours)</label>
        <input
          id="sleepHours"
          type="number"
          step="0.5"
          min={0}
          max={24}
          value={sleepHours}
          onChange={(e) => setSleepHours(e.target.value)}
          placeholder="e.g., 7.5"
        />
      </div>

      <div className="checkin-form__field">
        <label>Stress Level (1 = No Stress, 10 = Extreme Stress)</label>
        <div className="checkin-form__range">
          <input
            type="range"
            min={1}
            max={10}
            value={stressLevel}
            onChange={(e) => setStressLevel(parseInt(e.target.value))}
            className="checkin-form__slider"
          />
          <span className="checkin-form__value">{stressLevel}</span>
        </div>
      </div>

      <div className="checkin-form__field">
        <label htmlFor="notes">Notes (optional)</label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Anything on your mind?"
          rows={3}
          maxLength={1000}
        />
      </div>

      <button type="submit" className="checkin-form__submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save Check-in'}
      </button>
    </form>
  );
}