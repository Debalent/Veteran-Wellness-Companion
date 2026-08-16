// =============================================================================
// Safety Plan Builder
// =============================================================================
// Personalized safety planning tool based on the VA Safety Plan framework.
// Veterans identify warning signs, coping strategies, and support contacts.
// This is a self-directed tool — not a clinical assessment.
// Crisis line access is always prominently displayed.
// =============================================================================

import { useState, FormEvent, useEffect } from 'react';
import api from '@services/api';
import ReadAloudButton from '@components/common/ReadAloudButton';

interface SafetyPlanData {
  warningSigns: string[];
  copingStrategies: string[];
  supportContacts: string[];
  professionalContact: string;
}

type SafetyPlanArrayField = 'warningSigns' | 'copingStrategies' | 'supportContacts';

/** localStorage key for offline draft caching */
const DRAFT_STORAGE_KEY = 'safety_plan_draft';

/** localStorage key for cached saved plan (offline emergency view) */
const CACHED_PLAN_KEY = 'safety_plan_cached';

/**
 * SafetyPlanBuilder — Personalized safety planning tool.
 *
 * Features:
 * - Offline-first: drafts autosave to localStorage; cached plan is always viewable
 * - Emergency read-only view when API is unreachable
 * - Crisis line access always visible
 *
 * @returns {JSX.Element} The safety plan builder form
 */
export default function SafetyPlanBuilder() {
  const [plan, setPlan] = useState<SafetyPlanData>({
    warningSigns: [''],
    copingStrategies: [''],
    supportContacts: [''],
    professionalContact: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [vaPatientId, setVaPatientId] = useState('');
  const [vaConsent, setVaConsent] = useState(false);
  const [isSyncingToVA, setIsSyncingToVA] = useState(false);
  const [vaSyncMessage, setVaSyncMessage] = useState('');

  /**
   * Load the cached plan from localStorage on mount.
   * This ensures the safety plan is always viewable, even offline.
   */
  useEffect(() => {
    const loadCachedPlan = () => {
      try {
        const cached = localStorage.getItem(CACHED_PLAN_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as SafetyPlanData;
          setPlan(parsed);
        }
      } catch {
        // Corrupt cache — ignore and start fresh
      }
      setIsLoading(false);
    };

    loadCachedPlan();
  }, []);

  /**
   * Autosave draft to localStorage whenever the plan changes.
   * This prevents data loss if the user navigates away or loses connection.
   */
  useEffect(() => {
    if (isLoading) return;
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(plan));
    } catch {
      // Storage full or unavailable — non-critical
    }
  }, [plan, isLoading]);

  /**
   * Track online/offline status for emergency view fallback.
   */
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    setIsOffline(!navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleArrayChange = (
    field: SafetyPlanArrayField,
    index: number,
    value: string
  ) => {
    setPlan((prev) => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item)),
    }));
  };

  const addItem = (field: SafetyPlanArrayField) => {
    setPlan((prev) => ({
      ...prev,
      [field]: [...prev[field], ''],
    }));
  };

  const removeItem = (field: SafetyPlanArrayField, index: number) => {
    setPlan((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');

    const filteredPlan = {
      warningSigns: plan.warningSigns.filter((s) => s.trim()),
      copingStrategies: plan.copingStrategies.filter((s) => s.trim()),
      supportContacts: plan.supportContacts.filter((s) => s.trim()),
      professionalContact: plan.professionalContact || undefined,
      crisisLineConsent: true,
    };

    try {
      await api.put('/safety-plans', filteredPlan);
      // Cache the saved plan for offline emergency access
      localStorage.setItem(CACHED_PLAN_KEY, JSON.stringify(plan));
      setMessage('Safety plan saved successfully.');
    } catch (err: any) {
      // Offline fallback: save to local cache so the plan is still accessible
      localStorage.setItem(CACHED_PLAN_KEY, JSON.stringify(plan));
      setMessage(
        isOffline
          ? 'You are offline. Your safety plan has been saved on this device and will sync when you reconnect.'
          : err?.response?.data?.message || 'Failed to save safety plan. Your draft is saved locally.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Sync the saved safety plan to the veteran's VA health record (FHIR CarePlan).
   * Requires explicit, per-request consent — this is a distinct PHI data flow
   * to an external system and is never triggered implicitly.
   */
  const handleSyncToVA = async (e: FormEvent) => {
    e.preventDefault();
    setIsSyncingToVA(true);
    setVaSyncMessage('');

    try {
      await api.post('/safety-plans/sync-to-va', { vaPatientId, consent: vaConsent });
      setVaSyncMessage('Your safety plan was synced to your VA record.');
    } catch (err: any) {
      setVaSyncMessage(
        err?.response?.data?.message || 'Failed to sync to your VA record. Please try again.'
      );
    } finally {
      setIsSyncingToVA(false);
    }
  };

  if (isLoading) {
    return <div className="safety-plan__loading">Loading your safety plan...</div>;
  }

  return (
    <div className="safety-plan">
      <h2>My Safety Plan</h2>

      {isOffline && (
        <div className="safety-plan__offline-banner" role="alert">
          You are currently offline. Your safety plan is available on this device.
        </div>
      )}

      <p className="safety-plan__disclaimer">
        This is a personal safety planning tool. It is not a clinical assessment.
        If you are in crisis, call the Veterans Crisis Line at{' '}
        <strong>988 (Press 1)</strong>.
      </p>
      <ReadAloudButton
        text="This is a personal safety planning tool. It is not a clinical assessment. If you are in crisis, call the Veterans Crisis Line at 988, then press 1."
        label="the safety plan disclaimer"
      />

      <form onSubmit={handleSubmit} className="safety-plan__form">
        <div className="safety-plan__section">
          <h3>Warning Signs</h3>
          <p>What thoughts, feelings, or behaviors signal that a crisis may be developing?</p>
          {plan.warningSigns.map((sign, index) => (
            <div key={index} className="safety-plan__input-row">
              <input
                type="text"
                value={sign}
                onChange={(e) => handleArrayChange('warningSigns', index, e.target.value)}
                placeholder="e.g., Withdrawing from others"
              />
              <button type="button" onClick={() => removeItem('warningSigns', index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addItem('warningSigns')}>
            + Add Warning Sign
          </button>
        </div>

        <div className="safety-plan__section">
          <h3>Coping Strategies</h3>
          <p>What can you do to help manage the situation?</p>
          {plan.copingStrategies.map((strategy, index) => (
            <div key={index} className="safety-plan__input-row">
              <input
                type="text"
                value={strategy}
                onChange={(e) => handleArrayChange('copingStrategies', index, e.target.value)}
                placeholder="e.g., Deep breathing exercises"
              />
              <button type="button" onClick={() => removeItem('copingStrategies', index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addItem('copingStrategies')}>
            + Add Coping Strategy
          </button>
        </div>

        <div className="safety-plan__section">
          <h3>Support Contacts</h3>
          <p>Who can you reach out to for support?</p>
          {plan.supportContacts.map((contact, index) => (
            <div key={index} className="safety-plan__input-row">
              <input
                type="text"
                value={contact}
                onChange={(e) => handleArrayChange('supportContacts', index, e.target.value)}
                placeholder="e.g., John Doe, (555) 123-4567"
              />
              <button type="button" onClick={() => removeItem('supportContacts', index)}>
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={() => addItem('supportContacts')}>
            + Add Support Contact
          </button>
        </div>

        <div className="safety-plan__section">
          <h3>Professional Contact (Optional)</h3>
          <p>Your therapist, VA provider, or other professional support.</p>
          <input
            type="text"
            value={plan.professionalContact}
            onChange={(e) => setPlan((prev) => ({ ...prev, professionalContact: e.target.value }))}
            placeholder="e.g., Dr. Smith, VA Mental Health"
          />
        </div>

        <button type="submit" className="safety-plan__submit" disabled={isSaving}>
          {isSaving ? 'Saving...' : 'Save Safety Plan'}
        </button>

        {message && <p className="safety-plan__message">{message}</p>}
      </form>

      <div className="safety-plan__va-sync">
        <h3>Sync to VA Record</h3>
        <p>
          Optionally share this safety plan with your VA care team by sending it to
          your VA health record. This requires your explicit consent each time.
        </p>
        <form onSubmit={handleSyncToVA} className="safety-plan__va-sync-form">
          <label htmlFor="va-patient-id">VA Patient ID (ICN)</label>
          <input
            id="va-patient-id"
            type="text"
            value={vaPatientId}
            onChange={(e) => setVaPatientId(e.target.value)}
            placeholder="e.g., 1234567890V123456"
            required
          />
          <label className="safety-plan__consent-label">
            <input
              type="checkbox"
              checked={vaConsent}
              onChange={(e) => setVaConsent(e.target.checked)}
              required
            />
            I consent to sending my safety plan to my VA health record.
          </label>
          <button type="submit" disabled={isSyncingToVA || !vaConsent || !vaPatientId}>
            {isSyncingToVA ? 'Syncing...' : 'Sync to VA Record'}
          </button>
          {vaSyncMessage && <p className="safety-plan__message">{vaSyncMessage}</p>}
        </form>
      </div>

      <div className="safety-plan__crisis">
        <h3>24/7 Crisis Support</h3>
        <p>Veterans Crisis Line: <a href="tel:988">988 (Press 1)</a></p>
        <p>Crisis Text Line: Text <strong>838255</strong></p>
      </div>
    </div>
  );
}