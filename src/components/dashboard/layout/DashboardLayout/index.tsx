'use client';

import { useState } from 'react';
import { Navbar } from '../Navbar';
import { Sidebar } from '../Sidebar';
import styles from './dashboard-layout.module.css';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className={styles.container}>
      <Navbar onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} />
      <div className={styles.content}>
        <Sidebar collapsed={sidebarCollapsed} />
        <main className={`${styles.main} ${sidebarCollapsed ? styles.mainExpanded : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

