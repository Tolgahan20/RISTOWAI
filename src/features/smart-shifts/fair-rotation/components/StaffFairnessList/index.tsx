'use client';

import React from 'react';
import { Calendar, Clock, TrendingUp, TrendingDown } from 'react-feather';
import type { StaffFairness } from '../../types';
import styles from './staff-fairness-list.module.css';

interface StaffFairnessListProps {
  staffFairness: StaffFairness[];
}

export const StaffFairnessList: React.FC<StaffFairnessListProps> = ({
  staffFairness,
}) => {
  const getDeviationColor = (deviation: number) => {
    if (Math.abs(deviation) < 1) return '#10b981'; // Green
    if (Math.abs(deviation) < 2) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const sortedStaff = [...staffFairness].sort(
    (a, b) => b.weekendShiftsCount - a.weekendShiftsCount,
  );

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Distribuzione per Dipendente</h3>
      
      <div className={styles.list}>
        {sortedStaff.map((staff) => (
          <div key={staff.staffId} className={styles.card}>
            <div className={styles.header}>
              <div className={styles.staffInfo}>
                <h4 className={styles.staffName}>{staff.staffName}</h4>
                <span className={styles.staffRole}>{staff.role}</span>
              </div>
              <div
                className={styles.fairnessScore}
                style={{
                  '--score-color': getDeviationColor(staff.deviationFromAverage),
                } as React.CSSProperties}
              >
                {staff.fairnessScore}
              </div>
            </div>

            <div className={styles.stats}>
              <div className={styles.statItem}>
                <Calendar size={16} />
                <span className={styles.statLabel}>Weekend</span>
                <span className={styles.statValue}>{staff.weekendShiftsCount}</span>
              </div>

              <div className={styles.statItem}>
                <Calendar size={16} />
                <span className={styles.statLabel}>Totali</span>
                <span className={styles.statValue}>{staff.totalShiftsCount}</span>
              </div>

              <div className={styles.statItem}>
                <Clock size={16} />
                <span className={styles.statLabel}>Ore Weekend</span>
                <span className={styles.statValue}>{staff.weekendHours}h</span>
              </div>

              <div className={styles.statItem}>
                <Clock size={16} />
                <span className={styles.statLabel}>Ore Totali</span>
                <span className={styles.statValue}>{staff.totalHours}h</span>
              </div>
            </div>

            <div className={styles.deviation}>
              <div className={styles.deviationLabel}>
                Differenza dalla media:
              </div>
              <div
                className={styles.deviationValue}
                style={{ color: getDeviationColor(staff.deviationFromAverage) }}
              >
                {staff.deviationFromAverage > 0 ? (
                  <TrendingUp size={16} />
                ) : staff.deviationFromAverage < 0 ? (
                  <TrendingDown size={16} />
                ) : null}
                <span>
                  {staff.deviationFromAverage > 0 ? '+' : ''}
                  {staff.deviationFromAverage.toFixed(1)} turni
                </span>
              </div>
            </div>

            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${staff.weekendPercentage}%` }}
              />
            </div>
            <div className={styles.progressLabel}>
              {staff.weekendPercentage.toFixed(1)}% turni nel weekend
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

