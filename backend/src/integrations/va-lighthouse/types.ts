// =============================================================================
// VA Lighthouse API — FHIR resource types (subset)
// =============================================================================
// Minimal HL7 FHIR R4 shapes needed to map our internal models onto
// VA Lighthouse resources. Extend as additional endpoints are integrated.
// Reference: https://developer.va.gov/explore
// =============================================================================

export interface FhirCodeableConcept {
  text?: string;
  coding?: Array<{ system?: string; code?: string; display?: string }>;
}

export interface FhirReference {
  reference: string; // e.g. "Patient/1234"
  display?: string;
}

/** Maps to a veteran's Safety Plan — a self-directed, non-clinical plan. */
export interface FhirCarePlan {
  resourceType: 'CarePlan';
  status: 'draft' | 'active' | 'completed' | 'revoked';
  intent: 'plan';
  title: string;
  subject: FhirReference;
  activity: Array<{
    detail: {
      kind: 'Task';
      status: 'not-started' | 'in-progress' | 'completed';
      description: string;
    };
  }>;
}

/** Maps to a wellness check-in data point (e.g., mood score). */
export interface FhirObservation {
  resourceType: 'Observation';
  status: 'final' | 'amended' | 'preliminary';
  code: FhirCodeableConcept;
  subject: FhirReference;
  effectiveDateTime: string; // ISO 8601
  valueString?: string;
  valueInteger?: number;
}
