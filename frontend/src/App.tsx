// =============================================================================
// Root Application Component
// =============================================================================
// Sets up routing, initializes auth state, and renders the application shell.
// =============================================================================

import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import AppShell from '@components/layout/AppShell';
import LoginPage from '@components/auth/LoginForm';
import RegisterPage from '@components/auth/RegisterForm';
import Dashboard from '@components/layout/Dashboard';
import MoodCheckinForm from '@components/checkins/MoodCheckinForm';
import CheckinHistory from '@components/checkins/CheckinHistory';
import GoalTracker from '@components/goals/GoalTracker';
import SafetyPlanBuilder from '@components/safety-planning/SafetyPlanBuilder';
import RemindersPage from '@components/reminders/RemindersPage';
import EducationPage from '@components/education/EducationPage';
import ResourcesPage from '@components/resources/ResourcesPage';
import MyTripsPage from '@components/mobility/MyTripsPage';

/**
 * ProtectedRoute wrapper — redirects unauthenticated users to login.
 */
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

export default function App() {
  const initialize = useAuthStore((state) => state.initialize);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" replace /> : <RegisterPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="checkins" element={<CheckinHistory />} />
        <Route path="checkins/new" element={<MoodCheckinForm />} />
        <Route path="goals" element={<GoalTracker />} />
        <Route path="safety-plan" element={<SafetyPlanBuilder />} />
        <Route path="reminders" element={<RemindersPage />} />
        <Route path="education" element={<EducationPage />} />
        <Route path="resources" element={<ResourcesPage />} />
        <Route path="my-trips" element={<MyTripsPage />} />
      </Route>
    </Routes>
  );
}