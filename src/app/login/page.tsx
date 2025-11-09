'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ArrowLeft } from 'react-feather';
import {LoginForm} from '@/features/auth/components/LoginForm';
import styles from './page.module.css';

export default function LoginPage() {
  const [showReveal, setShowReveal] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setShowReveal(false);
      },
    });

    tl.to(`.${styles.revealLeft}`, {
      x: '-100%',
      duration: 0.8,
      ease: 'power3.inOut',
    })
      .to(
        `.${styles.revealRight}`,
        {
          x: '100%',
          duration: 0.8,
          ease: 'power3.inOut',
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

      <div className={styles.container}>
        {/* Left Panel - Dark Theme */}
        <div className={styles.leftPanel}>
          <div className={styles.leftContent}>
            <Link href="/" className={styles.logoLink}>
              <Image
                src="/full_logo_white.svg"
                alt="Ristowai"
                width={160}
                height={54}
                priority
              />
            </Link>

            <div className={styles.heroContent}>
              <h1 className={styles.heroTitle}>
                Bentornato su Ristowai
              </h1>
              <p className={styles.heroSubtitle}>
                Accedi per continuare a gestire il tuo ristorante con l&apos;intelligenza artificiale.
              </p>
            </div>

            <div className={styles.features}>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✓</div>
                <div className={styles.featureText}>
                  <h3>Gestione turni automatizzata</h3>
                  <p>Ottimizza i turni del personale con l&apos;AI</p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✓</div>
                <div className={styles.featureText}>
                  <h3>Analisi costi in tempo reale</h3>
                  <p>Monitora e riduci i costi operativi</p>
                </div>
              </div>
              <div className={styles.feature}>
                <div className={styles.featureIcon}>✓</div>
                <div className={styles.featureText}>
                  <h3>Ottimizzazione menu</h3>
                  <p>Massimizza i profitti con suggerimenti AI</p>
                </div>
              </div>
            </div>

            <div className={styles.leftFooter}>
              <Link href="/legal?section=privacy" className={styles.footerLink}>
                Privacy
              </Link>
              <Link href="/legal?section=terms" className={styles.footerLink}>
                Termini
              </Link>
              <Link href="/contact" className={styles.footerLink}>
                Contatti
              </Link>
            </div>
          </div>
        </div>

        {/* Right Panel - Light Theme */}
        <div className={styles.rightPanel} data-section="white">
          <div className={styles.rightContent}>
            <div className={styles.header}>
              <Link href="/" className={styles.backButton}>
                <ArrowLeft size={20} />
                <span>Indietro</span>
              </Link>
              <div className={styles.registerLink}>
                Non hai un account?{' '}
                <Link href="/register">Registrati</Link>
              </div>
            </div>

            <div className={styles.mobileLogo}>
              <Image
                src="/full_logo_black.svg"
                alt="Ristowai"
                width={140}
                height={54}
                priority
              />
            </div>

            <div className={styles.formContainer}>
              <LoginForm />
            </div>

            <div className={styles.rightFooter}>
              <Link href="/legal?section=privacy">Privacy Policy</Link>
              <span>·</span>
              <Link href="/legal?section=terms">Termini di Servizio</Link>
              <span>·</span>
              <Link href="/legal?section=cookies">Cookie Policy</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

