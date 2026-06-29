// =============================================================================
// Crisis Hotline Button
// =============================================================================
// Always-visible button providing one-touch access to the Veterans Crisis Line.
// This button is displayed on every screen of the application.
// =============================================================================

export default function CrisisHotlineButton() {
  return (
    <div className="crisis-button-container">
      <a
        href="tel:988"
        className="crisis-button"
        aria-label="Veterans Crisis Line — Dial 988 then Press 1"
      >
        <span className="crisis-button__icon">🆘</span>
        <span className="crisis-button__text">
          Veterans Crisis Line: 988 (Press 1)
        </span>
      </a>
    </div>
  );
}