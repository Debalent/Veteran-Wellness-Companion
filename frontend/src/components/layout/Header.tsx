// =============================================================================
// Header Component
// =============================================================================
// Top navigation bar with app title and user menu.
// =============================================================================

import { useAuthStore } from '@store/authStore';

export default function Header() {
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  return (
    <header className="header">
      <div className="header__brand">
        <h1 className="header__title">Veteran Wellness Companion</h1>
      </div>
      <div className="header__user">
        <span className="header__name">{user?.displayName}</span>
        <button onClick={logout} className="header__logout">
          Sign Out
        </button>
      </div>
    </header>
  );
}