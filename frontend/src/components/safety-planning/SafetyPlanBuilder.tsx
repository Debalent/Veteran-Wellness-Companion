// =============================================================================
// Safety Plan Builder
// =============================================================================
// Personalized safety planning tool based on the VA Safety Plan framework.
// Veterans identify warning signs, coping strategies, and support contacts.
// This is a self-directed tool — not a clinical assessment.
// Crisis line access is always prominently displayed.
// =============================================================================

import { useState, FormEvent } from 'react';
import api from '@services/api';

interface SafetyPlanData {
  warningSigns: string[];
  copingStrategies: string[];
  supportContacts: string[];
  professionalContact: string;
}

type SafetyPlanArrayField = 'warningSigns' | 'copingStrategies' | 'supportContacts';

export default function SafetyPlanBuilder() {
  const [plan, setPlan] = useState<SafetyPlanData>({
    warningSigns: [''],
    copingStrategies: [''],
    supportContacts: [''],
    professionalContact: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

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

    try {
      const filteredPlan = {
        warningSigns: plan.warningSigns.filter((s) => s.trim()),
        copingStrategies: plan.copingStrategies.filter((s) => s.trim()),
        supportContacts: plan.supportContacts.filter((s) => s.trim()),
        professionalContact: plan.professionalContact || undefined,
        crisisLineConsent: true,
      };

      await api.put('/safety-plans', filteredPlan);
      setMessage('Safety plan saved successfully.');
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Failed to save safety plan.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="safety-plan">
      <h2>My Safety Plan</h2>
      <p className="safety-plan__disclaimer">
        This is a personal safety planning tool. It is not a clinical assessment.
        If you are in crisis, call the Veterans Crisis Line at{' '}
        <strong>988 (Press 1)</strong>.
      </p>

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

      <div className="safety-plan__crisis">
        <h3>24/7 Crisis Support</h3>
        <p>Veterans Crisis Line: <a href="tel:988">988 (Press 1)</a></p>
        <p>Crisis Text Line: Text <strong>838255</strong></p>
      </div>
    </div>
  );
}