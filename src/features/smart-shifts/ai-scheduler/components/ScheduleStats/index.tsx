'use client';

import { FileText, Clock, DollarSign, CheckCircle } from 'react-feather';
import type { ScheduleMetadata } from '../../types';
import styles from './schedule-stats.module.css';

interface ScheduleStatsProps {
  metadata: ScheduleMetadata;
}

export function ScheduleStats({ metadata }: ScheduleStatsProps) {
  const stats = [
    {
      label: 'Turni Totali',
      value: metadata.totalShifts,
      Icon: FileText,
    },
    {
      label: 'Ore Totali',
      value: metadata.totalHours.toFixed(1),
      Icon: Clock,
    },
    {
      label: 'Costo Stimato',
      value: `€${metadata.totalEstimatedCost.toFixed(2)}`,
      Icon: DollarSign,
    },
    {
      label: 'Copertura Fasi',
      value: `${metadata.phaseCoveragePercentage}%`,
      Icon: CheckCircle,
    },
  ];

  return (
    <div className={styles.statsGrid}>
      {stats.map((stat, index) => (
        <div key={index} className={styles.statCard}>
          <div className={styles.statIcon}>
            <stat.Icon size={28} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statValue}>{stat.value}</div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

