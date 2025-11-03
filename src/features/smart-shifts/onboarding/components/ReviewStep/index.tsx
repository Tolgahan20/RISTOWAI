'use client';

import { Button } from '@/components/dashboard/ui';
import type { OnboardingSession } from '../../types';
import styles from './review-step.module.css';

interface ReviewStepProps {
  session: OnboardingSession;
  onComplete: () => void;
  isCompleting: boolean;
}

export function ReviewStep({ session, onComplete, isCompleting }: ReviewStepProps) {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>

        <h1 className={styles.title}>Configurazione Completa!</h1>
        <p className={styles.description}>
          Hai configurato con successo il tuo locale. Stiamo creando tutto per te...
        </p>

        <div className={styles.summary}>
          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>Locale</div>
            <div className={styles.summaryValue}>{session.venueInfo?.name}</div>
          </div>

          {session.workPhases && session.workPhases.phases && session.workPhases.phases.length > 0 && (
            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Fasi di lavoro</div>
              <div className={styles.summaryValue}>{session.workPhases.phases.length} fasi configurate</div>
            </div>
          )}

          {session.staffImport && session.staffImport.staff && session.staffImport.staff.length > 0 && (
            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Staff</div>
              <div className={styles.summaryValue}>{session.staffImport.staff.length} membri</div>
            </div>
          )}

          {session.holidayCalendar && session.holidayCalendar.holidays && session.holidayCalendar.holidays.length > 0 && (
            <div className={styles.summaryItem}>
              <div className={styles.summaryLabel}>Festività</div>
              <div className={styles.summaryValue}>{session.holidayCalendar.holidays.length} giorni</div>
            </div>
          )}

          <div className={styles.summaryItem}>
            <div className={styles.summaryLabel}>Rilevazione presenze</div>
            <div className={styles.summaryValue}>QR Code (Automatico)</div>
          </div>
        </div>

        <Button 
          onClick={onComplete} 
          disabled={isCompleting} 
          size="large" 
          fullWidth
        >
          {isCompleting ? 'Creazione in corso...' : 'Vai alla Dashboard'}
        </Button>
      </div>
    </div>
  );
}

