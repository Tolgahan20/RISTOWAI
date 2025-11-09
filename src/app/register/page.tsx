'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { UrlObject } from 'url';
import Image from 'next/image';
import { ArrowLeft } from 'react-feather';
import { gsap } from 'gsap';
import { RegisterForm } from '@/features/auth/components/RegisterForm';
import styles from './page.module.css';

export default function RegisterPage() {
  const [showReveal, setShowReveal] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setShowReveal(false);
      },
    });

    tl.to(`.${styles.revealLeft}`, {
      x: '-100%',
      duration: 1,
      ease: 'power4.inOut',
    }).to(
      `.${styles.revealRight}`,
      {
        x: '100%',
        duration: 1,
        ease: 'power4.inOut',
      },
      '<'
    );

    return () => {
      tl.kill();
    };
  }, []);

  return (
    <>
      {showReveal && (
        <div className={styles.pageReveal}>
          <div className={styles.revealLeft}></div>
          <div className={styles.revealRight}></div>
        </div>
      )}

      <div className={styles.container} data-section="white">
        {/* Left Panel - Hidden on mobile */}
        <div className={styles.leftPanel}>
          <div className={styles.leftPanelContent}>
            <Link href="/" className={styles.logo}>
              <Image
                src="/full_logo_white.svg"
                alt="Ristowai"
                width={180}
                height={54}
                priority
              />
            </Link>

            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Gestisci il tuo ristorante con l&apos;intelligenza artificiale
              </h1>
              <p className={styles.heroSubtitle}>
                Ottimizza turni, riduci costi e migliora l&apos;esperienza del cliente con Ristowai.
              </p>
            </div>

            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✓</div>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitle}>Prova gratuita di 1 mese</h3>
                  <p className={styles.featureDescription}>
                    Nessuna carta di credito richiesta
                  </p>
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>✓</div>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitle}>Supporto completo</h3>
                  <p className={styles.featureDescription}>
                    Assistenza dedicata per il tuo onboarding
                  </p>
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>✓</div>
                <div className={styles.featureText}>
                  <h3 className={styles.featureTitle}>Cancellazione in qualsiasi momento</h3>
                  <p className={styles.featureDescription}>
                    Nessun vincolo contrattuale
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.leftPanelFooter}>
              <p className={styles.footerText}>
                &copy; {new Date().getFullYear()} Ristowai. Realizzato in Italia.
              </p>
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className={styles.rightPanel}>
          <div className={styles.rightPanelHeader}>
            <Link href="/" className={styles.backButton}>
              <ArrowLeft size={20} />
              <span className={styles.backButtonText}>Indietro</span>
            </Link>

            <Link href={"/login" as unknown as UrlObject} className={styles.loginLink}>
              Hai già un account? <span className={styles.loginLinkBold}>Accedi</span>
            </Link>
          </div>

          <div className={styles.formContainer}>
            <RegisterForm />
          </div>

          <div className={styles.rightPanelFooter}>
            <Link href="/legal?section=privacy" className={styles.footerLink}>
              Privacy
            </Link>
            <span className={styles.footerDivider}>•</span>
            <Link href="/legal?section=terms" className={styles.footerLink}>
              Termini
            </Link>
            <span className={styles.footerDivider}>•</span>
            <Link href="/contact" className={styles.footerLink}>
              Contatti
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

