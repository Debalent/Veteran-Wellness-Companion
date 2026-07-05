# Security Control Baseline

Date: 2026-07-04
Scope: Veteran Wellness Companion platform baseline controls for proposal and implementation planning.
Reference frameworks: NIST SP 800-53 Rev. 5 (moderate-oriented), OWASP ASVS, CIS controls.

## Control Families

| Family | Objective | Baseline Implementation |
| --- | --- | --- |
| Access Control (AC) | Enforce least privilege and role separation | RBAC by role (veteran, VA employee, clinician, admin), deny-by-default endpoints, session timeout policy |
| Identification and Authentication (IA) | Strong identity assurance | JWT token validation, password strength policy, MFA-ready integration architecture |
| Audit and Accountability (AU) | Record security-relevant events | Structured logs for auth, admin actions, data access, and API write operations |
| Configuration Management (CM) | Maintain hardened, repeatable environments | Environment-specific config controls, change review, immutable deployment artifacts |
| Incident Response (IR) | Detect and respond to incidents quickly | Defined incident runbook, severity levels, communication matrix, and after-action process |
| System and Communications Protection (SC) | Protect data in transit and boundaries | TLS in transit, API gateway controls, network segmentation across trust boundaries |
| System and Information Integrity (SI) | Prevent, detect, and correct flaws | Dependency scanning, patch cadence, vulnerability triage, and secure coding checks |
| Contingency Planning (CP) | Preserve availability and recoverability | Backup policy, restore testing, RTO/RPO definitions, and runbook ownership |

## Data Protection Requirements

- Encryption in transit for all API traffic.
- Encryption at rest for application data stores and backups.
- Data minimization for sensitive fields and role-limited data access.
- Explicit consent controls for analytics and de-identified reporting paths.

## Control Evidence Expectations

- Access control matrix and role mapping.
- Authentication and session management test results.
- Log samples for required audit events.
- Vulnerability scan reports and remediation records.
- Incident tabletop exercise records and corrective actions.
- Backup and restore test evidence.

## Compliance Implementation Milestones

- M1: Baseline control mapping completed and approved.
- M2: Technical control implementation verified in lower environments.
- M3: Evidence package assembled for proposal and audit readiness.
- M4: Ongoing governance cadence established (monthly review cycle).
