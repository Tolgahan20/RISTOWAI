'use client';

import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import styles from './smooth-scroll.module.css';

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

interface SmoothScrollProps {
  children: React.ReactNode;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({ children }) => {
  const smoothWrapper = useRef<HTMLDivElement>(null);
  const smoother = useRef<ScrollSmoother | null>(null);

  useEffect(() => {
    // Check if we're on mobile/tablet
    const isMobile = window.innerWidth <= 1024;
    
    // Only create smooth scroller on desktop
    if (smoothWrapper.current && !isMobile) {
      smoother.current = ScrollSmoother.create({
        wrapper: smoothWrapper.current,
        content: smoothWrapper.current.querySelector('.smooth-content'),
        smooth: 1.5,
        effects: true,
        normalizeScroll: true,
        ignoreMobileResize: true,
        // Prevent smoothing on specific elements
        smoothTouch: 0,
      });

      // Mark navigation as fixed
      ScrollTrigger.saveStyles(".nav-fixed");
      ScrollTrigger.config({ limitCallbacks: true });
    } else if (isMobile) {
      // On mobile, just use regular ScrollTrigger without smooth scrolling
      ScrollTrigger.saveStyles(".nav-fixed");
      ScrollTrigger.config({ limitCallbacks: true });
    }

    // Handle anchor link clicks with smooth scroll (without changing URL)
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a[href^="#"]') as HTMLAnchorElement;
      
      if (anchor && anchor.hash) {
        e.preventDefault();
        const targetId = anchor.hash.substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const offset = 100;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - offset;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick, true);

    return () => {
      document.removeEventListener('click', handleAnchorClick);
      if (smoother.current) {
        smoother.current.kill();
      }
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <div ref={smoothWrapper} className={styles.smoothWrapper}>
      <div className={`smooth-content ${styles.smoothContent}`}>
        {children}
      </div>
    </div>
  );
};