// =============================================================================
// Crisis Hotline Button
// =============================================================================
// Always-visible button providing one-touch access to the Veterans Crisis Line.
// This button is displayed on every screen of the application.
//
// SECURITY & PRIVACY:
// - No PII is stored or transmitted by this component
// - All crisis resources are public, non-PHI information
// - Offline fallback ensures crisis access even without network
//
// REDUNDANCY & OFFLINE ACCESS:
// - Primary: tel:988 (voice call)
// - Fallback 1: SMS text line (838255)
// - Fallback 2: Web chat URL
// - Keyboard shortcut: Ctrl+Shift+C for one-touch access
// =============================================================================

import { useEffect, useState } from 'react';

/**
 * CrisisHotlineButton — Always-visible crisis support button.
 *
 * Provides redundant crisis access channels:
 * - Voice: Dial 988 then Press 1
 * - Text: Text 838255
 * - Web: Veterans Crisis Line chat
 *
 * Features:
 * - Offline detection: shows static fallback when network is unavailable
 * - Keyboard shortcut: Ctrl+Shift+C triggers the primary crisis action
 * - High-contrast styling for accessibility
 *
 * @returns {JSX.Element} The crisis hotline button
 */
export default function CrisisHotlineButton() {
  const [isOffline, setIsOffline] = useState(false);

  /**
   * Track online/offline status to provide appropriate fallback.
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

  /**
   * Keyboard shortcut handler — Ctrl+Shift+C triggers crisis call.
   * This provides one-touch emergency access from any screen.
   */
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        window.location.href = 'tel:988';
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="crisis-button-container">
      <a
        href="tel:988"
        className="crisis-button"
        aria-label="Veterans Crisis Line — Dial 988 then Press 1"
        title="Press Ctrl+Shift+C for one-touch crisis access"
      >
        <span className="crisis-button__icon">🆘</span>
        <span className="crisis-button__text">
          Veterans Crisis Line: 988 (Press 1)
        </span>
      </a>

      <div className="crisis-button__fallbacks">
        <a
          href="sms:838255"
          className="crisis-button__fallback"
          aria-label="Crisis Text Line — Text 838255"
        >
          Text 838255
        </a>
        <a
          href="https://www.veteranscrisisline.net/get-help/chat"
          target="_blank"
          rel="noopener noreferrer"
          className="crisis-button__fallback"
          aria-label="Veterans Crisis Line web chat"
        >
          Web Chat
        </a>
      </div>

      {isOffline && (
        <p className="crisis-button__offline" role="status">
          You are offline. Call 988 (Press 1) for immediate support.
        </p>
      )}
    </div>
  );
}
