'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Calendar, Clock, Settings as SettingsIcon, User, LogOut, ChevronDown } from 'react-feather';
import type { Staff } from '@/features/smart-shifts/staff/types';
import styles from './staff-navbar.module.css';

interface StaffNavbarProps {
  token: string;
}

export const StaffNavbar: React.FC<StaffNavbarProps> = ({ token }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [showSettings, setShowSettings] = useState(false);

  // Fetch staff data
  const { data: staff } = useQuery({
    queryKey: ['staffByToken', token],
    queryFn: async () => {
      const response = await axios.get<Staff>(
        `${process.env.NEXT_PUBLIC_API_URL}/staff/portal/${token}`
      );
      return response.data;
    },
    enabled: !!token,
  });

  const navItems = [
    {
      label: 'I Miei Turni',
      icon: <Calendar size={18} />,
      path: `/s/${token}/schedule`,
    },
    {
      label: 'Preferenze',
      icon: <SettingsIcon size={18} />,
      path: `/s/${token}/availability`,
    },
    {
      label: 'Timbratura',
      icon: <Clock size={18} />,
      path: `/s/${token}/punch`,
    },
  ];

  const isActive = (path: string) => pathname === path;

  const staffName = staff ? `${staff.firstName || ''} ${staff.lastName || ''}`.trim() || 'Dipendente' : 'Caricamento...';

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        {/* Logo/Brand */}
        <div className={styles.brand}>
          <div className={styles.logo}>Ristowai</div>
          <div className={styles.subtitle}>Portale Dipendente</div>
        </div>

        {/* Navigation Items */}
        <div className={styles.navItems}>
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                // @ts-expect-error - Dynamic route path
                router.push(item.path);
              }}
              className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        {/* User Menu */}
        <div className={styles.userMenu}>
          <button
            className={styles.userButton}
            onClick={() => setShowSettings(!showSettings)}
          >
            <div className={styles.userInfo}>
              <div className={styles.userName}>{staffName}</div>
              {staff && (
                <div className={styles.userRole}>{staff.staffRole}</div>
              )}
            </div>
            <ChevronDown size={16} className={styles.chevron} />
          </button>

          {showSettings && (
            <>
              <div 
                className={styles.overlay} 
                onClick={() => setShowSettings(false)} 
              />
              <div className={styles.dropdown}>
                <button
                  className={styles.dropdownItem}
                  onClick={() => {
                    router.push(`/s/${token}/profile`);
                    setShowSettings(false);
                  }}
                >
                  <User size={16} />
                  <span>Il Mio Profilo</span>
                </button>
                <div className={styles.divider} />
                <button
                  className={`${styles.dropdownItem} ${styles.danger}`}
                  onClick={() => {
                    if (confirm('Sei sicuro di voler uscire?')) {
                      window.location.href = '/';
                    }
                  }}
                >
                  <LogOut size={16} />
                  <span>Esci</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

