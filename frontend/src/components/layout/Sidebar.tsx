// =============================================================================
// Sidebar Navigation
// =============================================================================
// Main navigation sidebar with links to all platform features.
// Crisis resources are always accessible from the sidebar.
// =============================================================================

import { NavLink } from 'react-router-dom';

const navItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/checkins', label: 'Wellness Check-ins', icon: '📝' },
  { to: '/goals', label: 'Goals & Habits', icon: '🎯' },
  { to: '/safety-plan', label: 'Safety Plan', icon: '🛡️' },
  { to: '/reminders', label: 'Reminders', icon: '⏰' },
  { to: '/education', label: 'Education', icon: '📚' },
  { to: '/resources', label: 'Resources', icon: '📖' },
  { to: '/my-trips', label: 'My Trips', icon: '🚌' },
];

export default function Sidebar() {
  return (
    <nav className="sidebar">
      <ul className="sidebar__nav">
        {navItems.map((item) => (
          <li key={item.to} className="sidebar__item">
            <NavLink
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`
              }
            >
              <span className="sidebar__icon">{item.icon}</span>
              <span className="sidebar__label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}