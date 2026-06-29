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
        <Route path="checkins" element={<div>Check-in History</div>} />
        <Route path="goals" element={<div>Goals & Habits</div>} />
        <Route path="safety-plan" element={<div>Safety Plan</div>} />
        <Route path="reminders" element={<div>Reminders</div>} />
        <Route path="education" element={<div>Education</div>} />
        <Route path="resources" element={<div>Resources</div>} />
      </Route>
    </Routes>
  );
}