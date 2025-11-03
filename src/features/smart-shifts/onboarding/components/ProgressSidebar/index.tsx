'use client';

import { Card } from '@/components/dashboard/ui';
import styles from './progress-sidebar.module.css';

interface Step {
  label: string;
  description: string;
}

interface ProgressSidebarProps {
  steps: Step[];
  currentStepIndex: number;
}

export function ProgressSidebar({ steps, currentStepIndex }: ProgressSidebarProps) {
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <aside className={styles.sidebar}>
      <div className={styles.content}>
        <div className={styles.header}>
          <h1 className={styles.logo}>Ristowai</h1>
          <p className={styles.tagline}>Configurazione Guidata</p>
        </div>

        <Card padding="medium" className={styles.progressCard}>
          <div className={styles.progressHeader}>
            <span className={styles.stepCounter}>
              Step {currentStepIndex + 1} di {steps.length}
            </span>
            <span className={styles.percentage}>{Math.round(progress)}%</span>
          </div>
          
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ height: `${progress}%` }}
            />
          </div>

          <div className={styles.steps}>
            {steps.map((step, index) => (
              <div
                key={index}
                className={`${styles.step} ${
                  index < currentStepIndex ? styles.completed :
                  index === currentStepIndex ? styles.active :
                  styles.upcoming
                }`}
              >
                <div className={styles.stepIcon}>
                  {index < currentStepIndex ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path 
                        d="M20 6L9 17L4 12" 
                        stroke="currentColor" 
                        strokeWidth="3" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className={styles.stepContent}>
                  <div className={styles.stepLabel}>{step.label}</div>
                  <div className={styles.stepDescription}>{step.description}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className={styles.help}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <path d="M12 16V12M12 8H12.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <div>
            <p className={styles.helpTitle}>Serve aiuto?</p>
            <a href="#" className={styles.helpLink}>Contatta il supporto</a>
          </div>
        </div>
      </div>
    </aside>
  );
}

