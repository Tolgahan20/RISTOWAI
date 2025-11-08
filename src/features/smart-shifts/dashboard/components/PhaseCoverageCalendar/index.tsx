'use client';

import React from 'react';
import type { DailyCoverage } from '../../types';
import styles from './phase-coverage-calendar.module.css';

interface PhaseCoverageCalendarProps {
  dailyCoverage: DailyCoverage[];
}

export const PhaseCoverageCalendar: React.FC<PhaseCoverageCalendarProps> = ({
  dailyCoverage,
}) => {
  const getStatusColor = (status: 'covered' | 'partial' | 'uncovered') => {
    switch (status) {
      case 'covered':
        return '#10b981'; // green
      case 'partial':
        return '#f59e0b'; // yellow
      case 'uncovered':
        return '#ef4444'; // red
      default:
        return '#d1d5db';
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('it-IT', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Copertura Fasi - 7 Giorni</h3>

      <div className={styles.calendar}>
        {dailyCoverage.map((day) => (
          <div key={day.date} className={styles.dayCard}>
            <div className={styles.dayHeader}>
              <p className={styles.dayDate}>{formatDate(day.date)}</p>
              <p
                className={styles.dayPercentage}
                style={{
                  color:
                    day.overallCoveragePercentage >= 100
                      ? '#10b981'
                      : day.overallCoveragePercentage >= 50
                        ? '#f59e0b'
                        : '#ef4444',
                }}
              >
                {day.overallCoveragePercentage}%
              </p>
            </div>

            <div className={styles.phases}>
              {day.phases.map((phase) => (
                <div key={phase.phaseId} className={styles.phaseBar}>
                  <div className={styles.phaseInfo}>
                    <span className={styles.phaseName}>{phase.phaseName}</span>
                    <span className={styles.phaseStaff}>
                      {phase.assignedStaff}/{phase.requiredStaff}
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${Math.min(phase.coveragePercentage, 100)}%`,
                        backgroundColor: getStatusColor(phase.status),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.legend}>
        <div className={styles.legendItem}>
          <div
            className={styles.legendDot}
            style={{ backgroundColor: '#10b981' }}
          />
          <span>Coperto (≥100%)</span>
        </div>
        <div className={styles.legendItem}>
          <div
            className={styles.legendDot}
            style={{ backgroundColor: '#f59e0b' }}
          />
          <span>Parziale (50-99%)</span>
        </div>
        <div className={styles.legendItem}>
          <div
            className={styles.legendDot}
            style={{ backgroundColor: '#ef4444' }}
          />
          <span>Scoperto (&lt;50%)</span>
        </div>
      </div>
    </div>
  );
};

