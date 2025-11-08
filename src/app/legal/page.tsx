'use client';
import React, { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import gsap from 'gsap';
import '@/components/landing-page/landing-globals.css';
import styles from './page.module.css';
import { DesktopNav } from '@/components/landing-page/layout/desktop-nav/DesktopNav';
import { MobileNav } from '@/components/landing-page/layout/mobile-nav/MobileNav';
import { Footer } from '@/components/landing-page/sections/footer';
import { SmoothScroll } from '@/components/landing-page/providers/SmoothScroll';
import { privacyPolicyContent, termsOfServiceContent, cookiePolicyContent } from './content';
import { Route } from 'next';

type LegalSection = 'privacy' | 'terms' | 'cookies';

function LegalPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [showReveal, setShowReveal] = useState(true);
  const contentRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<LegalSection>('privacy');
  
  // Update activeSection from URL params after mount
  useEffect(() => {
    try {
      const section = searchParams.get('section') as LegalSection;
      if (section && ['privacy', 'terms', 'cookies'].includes(section)) {
        setTimeout(() => {
          setActiveSection(section);
        }, 0);
      }
    } catch (error) {
      console.error('Error reading search params:', error);
      setTimeout(() => {
        setActiveSection('privacy');
      }, 0);
    }
  }, [searchParams]);

  useEffect(() => {
    const content = contentRef.current;
    const reveal = revealRef.current;

    if (!content || !reveal) return;

    // Initial state
    gsap.set(content, {
      visibility: "visible",
      opacity: 0,
    });

    // Create the reveal animation
    const tl = gsap.timeline({
      defaults: { duration: 1.2, ease: "power4.inOut" },
      onComplete: () => setShowReveal(false),
    });

    tl.to(
      `.${styles.revealLeft}`,
      {
        xPercent: -100,
        yPercent: -100,
      },
      0
    )
      .to(
        `.${styles.revealRight}`,
        {
          xPercent: 100,
          yPercent: 100,
        },
        0
      )
      .to(
        content,
        {
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.6"
      );

    return () => {
      tl.kill();
    };
  }, []);

  const handleSectionChange = (section: LegalSection) => {
    setActiveSection(section);
    try {
      router.push(`/legal?section=${section}` as unknown as Route, { scroll: false });
    } catch (error) {
      console.error('Error navigating:', error);
    }
  };

  const getContent = () => {
    switch (activeSection) {
      case 'privacy':
        return privacyPolicyContent;
      case 'terms':
        return termsOfServiceContent;
      case 'cookies':
        return cookiePolicyContent;
      default:
        return privacyPolicyContent;
    }
  };

  return (
    <>
      {showReveal && (
        <div ref={revealRef} className={styles.pageReveal}>
          <div className={styles.revealLeft}></div>
          <div className={styles.revealRight}></div>
        </div>
      )}

      <div ref={contentRef} className={styles.pageContent}>
        <DesktopNav />
        <MobileNav />

        <SmoothScroll>
          <main className={styles.main} data-section="white">
            <div className={styles.container}>
              <aside className={styles.sidebar}>
                <h2 className={styles.sidebarTitle}>Documentazione Legale</h2>
                <nav className={styles.sidebarNav}>
                  <button
                    className={`${styles.sidebarLink} ${activeSection === 'privacy' ? styles.active : ''}`}
                    onClick={() => handleSectionChange('privacy')}
                  >
                    Privacy Policy
                  </button>
                  <button
                    className={`${styles.sidebarLink} ${activeSection === 'terms' ? styles.active : ''}`}
                    onClick={() => handleSectionChange('terms')}
                  >
                    Terms of Service
                  </button>
                  <button
                    className={`${styles.sidebarLink} ${activeSection === 'cookies' ? styles.active : ''}`}
                    onClick={() => handleSectionChange('cookies')}
                  >
                    Cookie Policy
                  </button>
                </nav>
              </aside>

              <div className={styles.content}>
                {getContent()}
              </div>
            </div>
          </main>

          <Footer />
        </SmoothScroll>
      </div>
    </>
  );
}

function LegalPageSkeleton() {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem',
      padding: '2rem'
    }}>
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(0, 0, 0, 0.1)',
        borderTopColor: '#000',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <p style={{ color: 'rgba(0, 0, 0, 0.6)', fontSize: '0.9rem' }}>
        Caricamento...
      </p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function LegalPage() {
  return (
    <Suspense fallback={<LegalPageSkeleton />}>
      <LegalPageContent />
    </Suspense>
  );
}
