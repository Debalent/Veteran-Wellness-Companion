// =============================================================================
// Header Component
// =============================================================================
// Top navigation bar with app title, user menu, and accessibility toggle.
// =============================================================================

import { useState, useEffect } from 'react';
import { useAuthStore } from '@store/authStore';

/**
 * Header — Top navigation bar with app title and user menu.
 * Includes a high-contrast accessibility toggle for veterans
 * with visual impairments (WCAG AAA compliance).
 *
 * @returns {JSX.Element} The header component
 */
export default function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);

  /**
   * Initialize high-contrast mode from localStorage on mount.
   */
  useEffect(() => {
    const saved = localStorage.getItem('high_contrast') === 'true';
    setIsHighContrast(saved);
    if (saved) {
      document.documentElement.setAttribute('data-theme', 'high-contrast');
    }
  }, []);

  /**
   * Initialize large-text mode from localStorage on mount.
   */
  useEffect(() => {
    const saved = localStorage.getItem('large_text') === 'true';
    setIsLargeText(saved);
    if (saved) {
      document.documentElement.setAttribute('data-text-size', 'large');
    }
  }, []);

  /**
   * Toggle high-contrast mode and persist the preference.
   */
  const toggleHighContrast = () => {
    const next = !isHighContrast;
    setIsHighContrast(next);
    localStorage.setItem('high_contrast', String(next));
    if (next) {
      document.documentElement.setAttribute('data-theme', 'high-contrast');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  };

  /**
   * Toggle large-text mode and persist the preference.
   */
  const toggleLargeText = () => {
    const next = !isLargeText;
    setIsLargeText(next);
    localStorage.setItem('large_text', String(next));
    if (next) {
      document.documentElement.setAttribute('data-text-size', 'large');
    } else {
      document.documentElement.removeAttribute('data-text-size');
    }
  };

  return (
    <header className="header">
      <div className="header__brand">
        <img
          src="/branding/horizontal-logo-lockup.png"
          alt="Veteran Wellness Companion"
          className="header__logo"
        />
      </div>
      <div className="header__user">
        <button
          onClick={toggleHighContrast}
          className="header__accessibility"
          aria-pressed={isHighContrast}
          aria-label="Toggle high contrast mode"
          title="Toggle high contrast mode"
        >
          {isHighContrast ? '◐ High Contrast On' : '◑ High Contrast Off'}
        </button>
        <button
          onClick={toggleLargeText}
          className="header__accessibility"
          aria-pressed={isLargeText}
          aria-label="Toggle large text mode"
          title="Toggle large text mode"
        >
          {isLargeText ? 'A+ Large Text On' : 'A+ Large Text Off'}
        </button>
        <span className="header__name">{user?.displayName}</span>
        <button onClick={logout} className="header__logout">
          Sign Out
        </button>
      </div>
    </header>
  );
}
