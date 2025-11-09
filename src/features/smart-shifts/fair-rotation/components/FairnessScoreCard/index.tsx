'use client';

import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'react-feather';
import styles from './fairness-score-card.module.css';

interface FairnessScoreCardProps {
  score: number;
  averageWeekendShifts: number;
  standardDeviation: number;
  totalWeekendShifts: number;
}

export const FairnessScoreCard: React.FC<FairnessScoreCardProps> = ({
  score,
  averageWeekendShifts,
  standardDeviation,
  totalWeekendShifts,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // Green
    if (score >= 60) return '#f59e0b'; // Yellow
    return '#ef4444'; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Eccellente';
    if (score >= 60) return 'Buono';
    return 'Da Migliorare';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <TrendingUp size={24} />;
    if (score >= 60) return <Minus size={24} />;
    return <TrendingDown size={24} />;
  };

  return (
    <div className={styles.card}>
      <div className={styles.mainScore}>
        <div
          className={styles.scoreCircle}
          style={{
            '--score-color': getScoreColor(score),
            '--score-percentage': `${score}%`,
          } as React.CSSProperties}
        >
          <span className={styles.scoreValue}>{score}</span>
          <span className={styles.scoreMax}>/100</span>
        </div>
        <div className={styles.scoreInfo}>
          <h3 className={styles.scoreLabel}>{getScoreLabel(score)}</h3>
          <div className={styles.scoreIcon} style={{ color: getScoreColor(score) }}>
            {getScoreIcon(score)}
          </div>
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Turni Weekend Totali</span>
          <span className={styles.statValue}>{totalWeekendShifts}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Media per Dipendente</span>
          <span className={styles.statValue}>{averageWeekendShifts}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Deviazione Standard</span>
          <span className={styles.statValue}>{standardDeviation.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
};

