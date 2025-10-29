  'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ArrowUpRight, X } from 'react-feather';
import styles from './mobile-nav.module.css';
import { UrlObject } from 'url';

const navItems = [
  { label: 'Soluzioni', href: '#features' as const },
  { label: 'Mercato Attuale', href: '#market-stats' as const },
  { label: 'Come Funziona', href: '#how-it-works' as const },
  { label: 'Prezzi', href: '#pricing' as const },
  { label: "Lista d'attesa", href: '#waiting-list' as const },
  { label: 'Domande Frequenti', href: '#faq' as const },
];

export const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [mode, setMode] = useState<'default' | 'dark' | 'white'>('default');
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(null);
  const lastScrollTime = useRef<number>(0);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    // Prevent body scroll when menu is open
    document.body.style.overflow = !isOpen ? 'hidden' : 'unset';
  };

  useEffect(() => {
    const checkNavPosition = () => {
      const now = Date.now();
      if (now - lastScrollTime.current < 16) {
        rafRef.current = requestAnimationFrame(checkNavPosition);
        return;
      }
      lastScrollTime.current = now;

      const nav = navRef.current;
      if (!nav) return;

      const navRect = nav.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      let newMode: 'default' | 'dark' | 'white' = 'default';

      // Get all sections and calculate their visibility
      const sections = Array.from(document.querySelectorAll('section[data-section]'));
      const visibleSections = sections
        .map(section => {
          const rect = section.getBoundingClientRect();
          const visibleTop = Math.max(rect.top, 0);
          const visibleBottom = Math.min(rect.bottom, windowHeight);
          const visibleHeight = Math.max(0, visibleBottom - visibleTop);
          
          return {
            section,
            type: section.getAttribute('data-section'),
            visibleHeight,
            top: rect.top
          };
        })
        .filter(({ visibleHeight }) => visibleHeight > 0);

      // Find the section that's most visible and close to the nav
      const currentSection = visibleSections
        .find(({ top }) => navRect.bottom >= (top + 10));

      if (currentSection) {
        if (currentSection.type === 'features' || currentSection.type === 'dark') {
          newMode = 'dark';
        } else if (currentSection.type === 'white') {
          newMode = 'white';
        } else if (currentSection.type === 'light') {
          newMode = 'default';
        }
      }

      if (mode !== newMode) {
        setMode(newMode);
      }

      rafRef.current = requestAnimationFrame(checkNavPosition);
    };

    rafRef.current = requestAnimationFrame(checkNavPosition);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [mode]);

  return (
    <>
      <nav 
        ref={navRef}
        className={`${styles.nav} ${isOpen ? styles.menuOpen : ''} ${
          mode === 'dark' ? styles.darkMode : 
          mode === 'white' ? styles.whiteMode : ''
        }`}>
        <div className={styles.container}>
          <button
            className={`${styles.menuButton} ${isOpen ? styles.active : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
            aria-expanded={isOpen}
          >
            <span className={styles.menuIcon}></span>
          </button>

          {!isOpen && (
            <>
              <Link href={"/" as unknown as UrlObject} className={styles.logo}>
                <Image 
                  src={mode === 'dark' ? "/full_logo_white.svg" : "/full_logo_black.svg"} 
                  alt="Ristowai" 
                  width={120} 
                  height={40} 
                  priority 
                />
              </Link>

              <Link href={"/demo" as unknown as UrlObject} className={styles.demoButton}>
                <span>Beta Test</span>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div className={`${styles.menuOverlay} ${isOpen ? styles.open : ''}`}>
        <div className={styles.menuContent}>
          <div className={styles.menuInner}>
            <div className={styles.menuHeader}>
              <Link href={"/" as unknown as UrlObject} className={styles.menuLogo} onClick={toggleMenu}>
                <Image src="/full_logo_black.svg" alt="Ristowai" width={150} height={50} priority />
              </Link>
              <button
                className={styles.closeButton}
                onClick={toggleMenu}
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>

            <ul className={styles.navList}>
              {navItems.map((item) => {
                // If we're not on the homepage, prepend "/" to the href
                const isHomepage = pathname === '/';
                const href = isHomepage ? item.href : `/${item.href}`;
                return (
                  <li key={item.label} className={styles.navItem}>
                    <Link
                      href={href as unknown as UrlObject}
                      className={styles.navLink}
                      onClick={toggleMenu}
                    >
                      {item.label}
                      <ArrowUpRight size={24} />
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <Link href={"/demo" as unknown as UrlObject} className={styles.menuDemoButton} onClick={toggleMenu}>
            <span>Beta Test</span>
            <ArrowUpRight size={24} />
          </Link>
        </div>
      </div>
    </>
  );
};