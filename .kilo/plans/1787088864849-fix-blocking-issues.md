# Plan: Fix Blocking Issues for SAM.gov VA Bid Readiness

## Overview
This plan addresses the critical blocking issues preventing the Veteran Wellness Companion from achieving Phase 1 bid readiness. The main blockers are syntax errors preventing compilation and incomplete route integration.

## Current Status
- **Phase 1 overall**: 65% complete (from Phase 1 exit scorecard)
- **Build status**: Blocked due to syntax errors
- **Route integration**: Incomplete
- **Test coverage**: Missing
- **Documentation**: Incomplete

## Critical Issues (P1 Priority)

### Issue 1: SafetyPlanBuilder.tsx Syntax Error (P1-06)
**Location**: `frontend/src/components/safety-planning/SafetyPlanBuilder.tsx`
**Problem**: Import statements are not at the top of the file
**Impact**: Frontend fails to compile

### Issue 2: auth.routes.ts Syntax Error (P1-07)  
**Location**: `backend/src/routes/auth.routes.ts`
**Problem**: Import statements are not at the top of the file
**Impact**: Backend fails to compile

### Issue 3: Incomplete Route Integration (P1-04, P1-05)
**Location**: `frontend/src/App.tsx`
**Problem**: Several routes still render placeholders instead of actual feature components
**Impact**: Frontend functionality incomplete

### Issue 4: Missing Test Coverage (P1-08)
**Location**: No test files found in `backend/tests` or `frontend/tests`
**Problem**: No automated tests for critical paths
**Impact**: Bid readiness requires evidence of test coverage

### Issue 5: Missing API Documentation (P1-09)
**Location**: `docs/api/` (empty directory)
**Problem**: No OpenAPI specification or endpoint documentation
**Impact**: Proposal requires API documentation artifacts

### Issue 6: Missing Phase 1 Signoff (P1-10)
**Location**: `docs/bid/phase-1-signoff.md` (does not exist)
**Problem**: No formal Phase 1 signoff memorandum
**Impact**: Proposal package incomplete

## Implementation Tasks

### Task 1: Fix Syntax Errors
1. **SafetyPlanBuilder.tsx**: Move `import api from '@services/api';` and `import ReadAloudButton from '@components/common/ReadAloudButton';` to the top of the file with other imports
2. **auth.routes.ts**: Move all imports to the top of the file with `import { Router } from 'express';`

### Task 2: Complete Route Integration
1. **App.tsx**: Replace placeholder route components with actual feature components:
   - Current: Several routes render placeholders
   - Target: All routes should render actual feature components (check-ins, goals, safety plans, reminders, education, resources, etc.)

### Task 3: Add Test Coverage
1. **Backend tests**: Create Vitest tests for:
   - Auth routes (/register, /login, /me)
   - Checkin routes
   - Safety plan routes
2. **Frontend tests**: Create React component tests for:
   - Auth guard functionality
   - Main dashboard components
   - Safety plan save flow

### Task 4: Generate API Documentation
1. **docs/api/openapi.yaml**: Create OpenAPI 3.0 specification including all MVP endpoints:
   - Auth endpoints (/auth/register, /auth/login, /auth/me)
   - Check-in endpoints (/checkins)
   - Safety plan endpoints (/safety-plans, /safety-plans/sync-to-va)
   - All other domain APIs
2. **docs/api/README.md**: Document authentication requirements and API usage

### Task 5: Create Phase 1 Signoff
1. **docs/bid/phase-1-signoff.md**: Create Phase 1 signoff memorandum including:
   - Executive summary
   - Technical readiness confirmation
   - Test results
   - Build artifacts
   - Dependencies

## Verification Steps

After completing each task:

1. **Compilation Test**: Run `npm run build` in both `backend` and `frontend` directories
2. **Test Suite**: Run `npm test` to ensure all tests pass
3. **Route Functionality**: Verify all routes render correctly and API integration works
4. **Documentation Check**: Verify all required documentation files exist and are complete

## Success Criteria
Phase 1 is complete when:
- All P1-01 through P1-10 checklist items show "Done"
- Both applications build successfully without errors
- Minimum tests (auth/checkin/safety-plan) are created and pass
- API documentation is complete
- Phase 1 signoff memorandum is created
- All frontend routes integrate properly with backend APIs

## Dependencies
- Node.js with TypeScript
- Docker (for full environment)
- Access to git repository

## Risk Mitigation
- If compilation fails after any task, roll back and re-check syntax
- If tests fail, prioritize fixing core functionality first
- If documentation is incomplete, create minimal viable documentation to meet bid requirements

## Timeline Considerations
This is a critical path for bid readiness. All tasks should be completed in order as listed above, with highest priority given to fixing syntax errors first, followed by route integration and test coverage.
