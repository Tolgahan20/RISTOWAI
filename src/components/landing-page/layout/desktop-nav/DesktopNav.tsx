'use client';
import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import styles from './desktop-nav.module.css';
import { ArrowUpRight } from 'react-feather';
import { UrlObject } from 'url';

const navItems = [
  { label: 'Soluzioni', href: '#features' as const },
  { label: 'Mercato Attuale', href: '#market-stats' as const },
  { label: 'Come Funziona', href: '#how-it-works' as const },
  { label: 'Prezzi', href: '#pricing' as const },
  { label: "Lista d'attesa", href: '#waiting-list' as const },
  { label: 'Domande Frequenti', href: '#faq' as const },
];

export const DesktopNav: React.FC = () => {
  const [mode, setMode] = useState<'default' | 'dark' | 'white'>('default');
  const pathname = usePathname();
  const navRef = useRef<HTMLElement>(null);
  const rafRef = useRef<number>(null);
  const lastScrollTime = useRef<number>(0);

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
          // Calculate how much of the section is visible in the viewport
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
    <nav 
      ref={navRef} 
      className={`${styles.nav} ${
        mode === 'dark' ? styles.darkMode : 
        mode === 'white' ? styles.whiteMode : ''
      }`}>
      <div className={styles.container}>
        <Link href={"/" as unknown as UrlObject} className={styles.logo}>
          <Image 
            src={mode === 'dark' ? "/full_logo_white.svg" : "/full_logo_black.svg"} 
            alt="Ristowai" 
            width={120} 
            height={32} 
            style={{ width: 'auto', height: '44px' }}
          />
        </Link>

        <div className={styles.navListContainer}>
          <ul className={styles.navList}>
            {navItems.map((item) => {
              // If we're not on the homepage, prepend "/" to the href
              const isHomepage = pathname === '/';
              const href = isHomepage ? item.href : `/${item.href}`;
              return (
                <li key={item.label} className={styles.navItem}>
                  <Link href={href as unknown as UrlObject} className={styles.navLink}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <Link href={"/beta-test" as unknown as UrlObject} className={styles.demoButton}>
          <div className={styles.demoButtonInner}>
            <span className={styles.demoButtonText}>
              Beta Test
            </span>
            <ArrowUpRight size={18} />
          </div>
        </Link>
      </div>
    </nav>
  );
};