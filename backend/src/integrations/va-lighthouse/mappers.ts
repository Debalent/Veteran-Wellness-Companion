// =============================================================================
// VA Lighthouse Mappers
// =============================================================================
// Converts internal Safety Plan / Check-in models into HL7 FHIR R4 resources
// for submission to the VA Lighthouse API. Pure functions — no I/O.
// =============================================================================

import type { FhirCarePlan, FhirObservation } from './types.js';

interface SafetyPlanLike {
  copingStrategies: string[];
}

/** Map a (decrypted) Safety Plan to a FHIR CarePlan resource for a given patient. */
export function toFhirCarePlan(plan: SafetyPlanLike, patientId: string): FhirCarePlan {
  return {
    resourceType: 'CarePlan',
    status: 'active',
    intent: 'plan',
    title: 'Veteran Safety Plan',
    subject: { reference: `Patient/${patientId}` },
    activity: plan.copingStrategies.map((strategy) => ({
      detail: {
        kind: 'Task',
        status: 'not-started',
        description: strategy,
      },
    })),
  };
}

interface CheckinLike {
  mood: number;
  createdAt: Date;
}

/** Map a wellness check-in to a FHIR Observation resource for a given patient. */
export function toFhirObservation(checkin: CheckinLike, patientId: string): FhirObservation {
  return {
    resourceType: 'Observation',
    status: 'final',
    code: { text: 'Veteran wellness check-in mood score' },
    subject: { reference: `Patient/${patientId}` },
    effectiveDateTime: checkin.createdAt.toISOString(),
    valueInteger: checkin.mood,
  };
}
