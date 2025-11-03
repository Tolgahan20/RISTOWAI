'use client';

import { MapPin } from 'react-feather';
import type { ShiftAssignment } from '../../types';
import { formatTime, formatDate } from '../../utils';
import styles from './shift-card.module.css';

interface ShiftCardProps {
  shift: ShiftAssignment;
}

export function ShiftCard({ shift }: ShiftCardProps) {
  const startTime = new Date(shift.startTime);
  const endTime = new Date(shift.endTime);

  return (
    <div className={styles.card}>
      <div className={styles.left}>
        <div className={styles.date}>{formatDate(startTime)}</div>
        <div className={styles.time}>
          {formatTime(startTime)} - {formatTime(endTime)}
        </div>
      </div>

      <div className={styles.middle}>
        <div className={styles.staffName}>{shift.staffName}</div>
        <div className={styles.role}>{shift.role}</div>
        {shift.phaseName && (
          <div className={styles.phase}>
            <MapPin size={14} />
            {shift.phaseName}
          </div>
        )}
      </div>

      <div className={styles.right}>
        <div className={styles.hours}>{shift.hours.toFixed(1)}h</div>
        <div className={styles.cost}>€{shift.estimatedCost.toFixed(2)}</div>
      </div>
    </div>
  );
}

