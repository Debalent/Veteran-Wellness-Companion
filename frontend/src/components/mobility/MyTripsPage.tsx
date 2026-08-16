// =============================================================================
// My Trips — Lightweight Mobility & Independent Travel Feature
// =============================================================================
// Saved destinations and a one-tap "Get Me Home" shortcut for independent
// travel. Deliberately scoped down from a full ride-coordination system:
// no driver matching or dispatch — "Request Assistance" only flags the trip
// for a human support contact to follow up on.
// =============================================================================

import { useState, useEffect, FormEvent } from 'react';
import ReadAloudButton from '@components/common/ReadAloudButton';
import {
  getSavedTrips,
  createSavedTrip,
  deleteSavedTrip,
  requestTripAssistance,
  SavedTrip,
} from '@services/tripAssistanceService';

const INSTRUCTIONS =
  'My Trips lets you save places you go often, like home, work, or the VA clinic. ' +
  'Use the Get Me Home button any time for one-tap directions back to your saved home address. ' +
  'If a trip falls through, use Request Assistance to let your support contact know you need help.';

export default function MyTripsPage() {
  const [trips, setTrips] = useState<SavedTrip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({ label: '', origin: '', destination: '', notes: '', isHome: false });

  const loadTrips = async () => {
    setIsLoading(true);
    try {
      const data = await getSavedTrips();
      setTrips(data);
    } catch {
      setMessage('Unable to load your saved trips right now.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrips();
  }, []);

  const homeTrip = trips.find((trip) => trip.isHome);

  const handleAddTrip = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.label || !form.origin || !form.destination) return;

    try {
      await createSavedTrip(form);
      setForm({ label: '', origin: '', destination: '', notes: '', isHome: false });
      setMessage('Trip saved.');
      await loadTrips();
    } catch {
      setMessage('Could not save this trip. Please try again.');
    }
  };

  const handleDelete = async (tripId: string) => {
    try {
      await deleteSavedTrip(tripId);
      await loadTrips();
    } catch {
      setMessage('Could not remove this trip. Please try again.');
    }
  };

  const handleRequestAssistance = async (tripId: string) => {
    try {
      await requestTripAssistance(tripId);
      setMessage('Assistance requested. Your support contact will be notified.');
      await loadTrips();
    } catch {
      setMessage('Could not request assistance right now.');
    }
  };

  return (
    <div className="my-trips">
      <h2>My Trips</h2>
      <p className="my-trips__instructions">{INSTRUCTIONS}</p>
      <ReadAloudButton text={INSTRUCTIONS} label="My Trips instructions" />

      {homeTrip && (
        <button
          type="button"
          className="my-trips__get-home"
          aria-label={`Get me home to ${homeTrip.destination}`}
          onClick={() => handleRequestAssistance(homeTrip.id)}
        >
          🏠 Get Me Home
        </button>
      )}

      {message && (
        <p className="my-trips__message" role="status">
          {message}
        </p>
      )}

      {isLoading ? (
        <p>Loading your trips...</p>
      ) : (
        <ul className="my-trips__list" aria-label="Saved trips">
          {trips.map((trip) => (
            <li key={trip.id} className="my-trips__item">
              <h3>{trip.label}{trip.isHome ? ' (Home)' : ''}</h3>
              <p>
                From {trip.origin} to {trip.destination}
              </p>
              {trip.notes && <p className="my-trips__notes">{trip.notes}</p>}
              {trip.needsAssistance && (
                <p className="my-trips__assistance-flag" role="status">
                  Assistance requested — waiting for follow-up.
                </p>
              )}
              <div className="my-trips__item-actions">
                <button type="button" onClick={() => handleRequestAssistance(trip.id)}>
                  Request Assistance
                </button>
                <button type="button" onClick={() => handleDelete(trip.id)}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <form onSubmit={handleAddTrip} className="my-trips__form" aria-label="Add a new saved trip">
        <h3>Add a Trip</h3>
        <label htmlFor="trip-label">Label</label>
        <input
          id="trip-label"
          type="text"
          value={form.label}
          onChange={(e) => setForm((prev) => ({ ...prev, label: e.target.value }))}
          placeholder="e.g., Home, VA Appointment"
          required
        />
        <label htmlFor="trip-origin">Starting point</label>
        <input
          id="trip-origin"
          type="text"
          value={form.origin}
          onChange={(e) => setForm((prev) => ({ ...prev, origin: e.target.value }))}
          placeholder="e.g., My apartment"
          required
        />
        <label htmlFor="trip-destination">Destination</label>
        <input
          id="trip-destination"
          type="text"
          value={form.destination}
          onChange={(e) => setForm((prev) => ({ ...prev, destination: e.target.value }))}
          placeholder="e.g., VA Medical Center"
          required
        />
        <label htmlFor="trip-notes">Notes (optional)</label>
        <input
          id="trip-notes"
          type="text"
          value={form.notes}
          onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="e.g., Take the 24 bus to Main St"
        />
        <label className="my-trips__home-label">
          <input
            type="checkbox"
            checked={form.isHome}
            onChange={(e) => setForm((prev) => ({ ...prev, isHome: e.target.checked }))}
          />
          Set as my home address (used by Get Me Home)
        </label>
        <button type="submit">Save Trip</button>
      </form>
    </div>
  );
}
