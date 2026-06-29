// =============================================================================
// Application Shell Layout
// =============================================================================
// Main layout wrapper with sidebar navigation and content area.
// Crisis line button is always visible in the navigation.
// =============================================================================

import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import CrisisHotlineButton from '../crisis-support/CrisisHotlineButton';
import styles from './Layout.module.css';

export default function AppShell() {
  return (
    <div className={styles.shell}>
      <Header />
      <div className={styles.container}>
        <Sidebar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
      <CrisisHotlineButton />
    </div>
  );
}