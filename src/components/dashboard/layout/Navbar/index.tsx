'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { tokenService } from '@/features/auth/services/token.service';
import { useProfile } from '@/features/auth/hooks/profile';
import styles from './navbar.module.css';
import { UrlObject } from 'url';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export function Navbar({ onToggleSidebar }: NavbarProps) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const { data: profile } = useProfile();
  
  const displayName = profile 
    ? `${profile.firstName} ${profile.lastName}`
    : 'Caricamento...';

  const handleLogout = async () => {
    await tokenService.logout();
    router.push('/login');
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.left}>
        <button onClick={onToggleSidebar} className={styles.menuButton}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
        <Link href={"/dashboard" as unknown as UrlObject}  className={styles.logo}>
          <Image src="/full_logo_black.svg" alt="Ristowai" width={120} height={40} priority />
        </Link>
      </div>

      <div className={styles.right}>
        {/* Notifications */}
        <button className={styles.iconButton}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className={styles.badge}>3</span>
        </button>

        {/* User Menu */}
        <div className={styles.userMenu}>
          <button 
            onClick={() => setShowUserMenu(!showUserMenu)}
            className={styles.userButton}
          >
            <div className={styles.avatar}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span className={styles.userName}>{displayName}</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m6 9 6 6 6-6"/>
            </svg>
          </button>

          {showUserMenu && (
            <div className={styles.dropdown}>
              <Link href={"/dashboard/profile" as unknown as UrlObject} className={styles.dropdownItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
                Profilo
              </Link>
              <Link href={"/dashboard/settings" as unknown as UrlObject} className={styles.dropdownItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M12 1v6m0 6v6M5.64 5.64l4.24 4.24m4.24 4.24l4.24 4.24M1 12h6m6 0h6M5.64 18.36l4.24-4.24m4.24-4.24l4.24-4.24"/>
                </svg>
                Impostazioni
              </Link>
              <hr className={styles.divider} />
              <button onClick={handleLogout} className={styles.dropdownItem}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                  <polyline points="16 17 21 12 16 7"/>
                  <line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                Esci
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

