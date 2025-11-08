'use client';

import React from 'react';
import { Users, AlertCircle, Clock, CheckCircle, Lock, Unlock } from 'react-feather';
import type { WeeklySummary } from '../../types';
import { formatWeekRange } from '../../utils/weekHelpers';
import styles from './weekly-summary.module.css';

interface WeeklySummaryCardProps {
  summary: WeeklySummary;
  onLockWeek?: () => void;
  onUnlockWeek?: () => void;
  isLockLoading?: boolean;
}

export const WeeklySummaryCard: React.FC<WeeklySummaryCardProps> = ({
  summary,
  onLockWeek,
  onUnlockWeek,
  isLockLoading = false,
}) => {
  const complianceColor = 
    summary.complianceScore >= 90 ? '#10b981' :
    summary.complianceScore >= 70 ? '#f59e0b' :
    '#ef4444';

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Riepilogo Settimanale</h3>
          <p className={styles.weekRange}>
            {formatWeekRange(summary.weekStartDate)}
          </p>
        </div>
        <div className={styles.lockSection}>
          {summary.isLocked ? (
            <>
              <div className={styles.lockBadge}>
                <Lock size={14} />
                <span>Bloccata</span>
              </div>
              {onUnlockWeek && (
                <button
                  onClick={onUnlockWeek}
                  disabled={isLockLoading}
                  className={styles.lockButton}
                  title="Sblocca Settimana"
                >
                  <Unlock size={16} />
                </button>
              )}
            </>
          ) : (
            onLockWeek && (
              <button
                onClick={onLockWeek}
                disabled={isLockLoading}
                className={styles.lockButton}
                title="Blocca Settimana"
              >
                <Lock size={16} />
                Blocca
              </button>
            )
          )}
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <div className={styles.statIcon} style={{ backgroundColor: '#dbeafe' }}>
            <Users size={20} color="#3b82f6" />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Dipendenti</p>
            <p className={styles.statValue}>{summary.totalStaff}</p>
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.statIcon} style={{ backgroundColor: '#fef3c7' }}>
            <AlertCircle size={20} color="#f59e0b" />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Anomalie</p>
            <p className={styles.statValue}>
              {summary.unresolvedAnomalies}
              {summary.unresolvedAnomalies > 0 && (
                <span className={styles.statBadge}>da risolvere</span>
              )}
            </p>
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.statIcon} style={{ backgroundColor: '#fce7f3' }}>
            <Clock size={20} color="#ec4899" />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Ore Extra</p>
            <p className={styles.statValue}>
              {summary.pendingExtraHours}
              {summary.pendingExtraHours > 0 && (
                <span className={styles.statBadge}>da approvare</span>
              )}
            </p>
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.statIcon} style={{ backgroundColor: complianceColor + '20' }}>
            <CheckCircle size={20} color={complianceColor} />
          </div>
          <div className={styles.statContent}>
            <p className={styles.statLabel}>Conformità</p>
            <p className={styles.statValue} style={{ color: complianceColor }}>
              {summary.complianceScore}%
            </p>
          </div>
        </div>
      </div>

      <div className={styles.hours}>
        <div className={styles.hoursItem}>
          <span className={styles.hoursLabel}>Ore Pianificate:</span>
          <span className={styles.hoursValue}>{summary.totalPlannedHours.toFixed(1)}h</span>
        </div>
        <div className={styles.hoursItem}>
          <span className={styles.hoursLabel}>Ore Effettive:</span>
          <span className={styles.hoursValue}>{summary.totalActualHours.toFixed(1)}h</span>
        </div>
        <div className={styles.hoursItem}>
          <span className={styles.hoursLabel}>Differenza:</span>
          <span 
            className={styles.hoursValue}
            style={{ 
              color: summary.totalActualHours > summary.totalPlannedHours ? '#f59e0b' : '#10b981' 
            }}
          >
            {(summary.totalActualHours - summary.totalPlannedHours) >= 0 ? '+' : ''}
            {(summary.totalActualHours - summary.totalPlannedHours).toFixed(1)}h
          </span>
        </div>
      </div>
    </div>
  );
};

