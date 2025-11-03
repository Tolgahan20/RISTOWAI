'use client';

import Image from 'next/image';
import { useOnboarding } from '../../hooks/useOnboarding';
import styles from './welcome-screen.module.css';

interface WelcomeScreenProps {
  onStart: () => void;
}

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const { start, isStarting } = useOnboarding();

  const handleStart = async () => {
    await start();
    onStart();
  };
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Logo */}
        <div className={styles.logoWrapper}>
          <Image 
            src="/full_logo_black.svg" 
            alt="Ristowai" 
            width={160} 
            height={60}
            priority
          />
        </div>

        {/* Title */}
        <h1 className={styles.title}>Benvenuto su Ristowai</h1>
        <p className={styles.description}>
          Scegli come configurare il tuo locale e iniziare a gestire turni e presenze in modo intelligente
        </p>

        {/* Options Cards */}
        <div className={styles.options}>
          {/* AI Onboarding - Coming Soon */}
          <div className={styles.optionCard + ' ' + styles.disabled}>
            <div className={styles.badge}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
              </svg>
              Presto disponibile
            </div>
            <div className={styles.cardIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                <circle cx="12" cy="17" r="0.5" fill="currentColor"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Configurazione AI</h3>
            <p className={styles.cardDescription}>
              L&apos;intelligenza artificiale ti guiderà passo dopo passo, suggerendo le migliori configurazioni per il tuo locale
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Setup automatico
              </div>
              <div className={styles.feature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Suggerimenti intelligenti
              </div>
              <div className={styles.feature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Più veloce del 70%
              </div>
            </div>
            <button disabled className={styles.cardButton}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
              Presto disponibile
            </button>
          </div>

          {/* Manual Onboarding */}
          <div className={styles.optionCard + ' ' + styles.active} onClick={handleStart}>
            <div className={styles.recommended}>Consigliato per iniziare</div>
            <div className={styles.cardIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <h3 className={styles.cardTitle}>Configurazione Manuale</h3>
            <p className={styles.cardDescription}>
              Configura il tuo locale passo dopo passo con il massimo controllo su ogni dettaglio
            </p>
            <div className={styles.features}>
              <div className={styles.feature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Controllo completo
              </div>
              <div className={styles.feature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                5 minuti circa
              </div>
              <div className={styles.feature}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                Flessibilità massima
              </div>
            </div>
            <button className={styles.cardButton} disabled={isStarting}>
              {isStarting ? 'Caricamento...' : 'Inizia configurazione'}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14"/>
                <path d="M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Bottom text */}
        <p className={styles.bottomText}>
          Potrai sempre modificare le impostazioni dal pannello di controllo
        </p>
      </div>
    </div>
  );
}
