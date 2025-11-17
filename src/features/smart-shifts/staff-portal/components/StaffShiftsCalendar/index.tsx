'use client';

import { useMemo } from 'react';
import { Calendar, Clock } from 'react-feather';
import type { Shift } from '@/features/smart-shifts/schedules/types';
import styles from './shifts-calendar.module.css';

interface StaffShiftsCalendarProps {
  shifts: Shift[];
}

export const StaffShiftsCalendar: React.FC<StaffShiftsCalendarProps> = ({
  shifts,
}) => {
  // Group shifts by date
  const shiftsByDate = useMemo(() => {
    const grouped = new Map<string, Shift[]>();

    shifts.forEach((shift) => {
      // Extract date from startTime
      const startDate = new Date(shift.startTime);
      const dateKey = startDate.toISOString().split('T')[0]; // YYYY-MM-DD format

      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, []);
      }
      grouped.get(dateKey)!.push(shift);
    });

    // Sort dates
    return new Map(
      Array.from(grouped.entries()).sort((a, b) => a[0].localeCompare(b[0]))
    );
  }, [shifts]);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Compare dates (ignore time)
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const tomorrowOnly = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());

    if (dateOnly.getTime() === todayOnly.getTime()) {
      return 'Oggi';
    } else if (dateOnly.getTime() === tomorrowOnly.getTime()) {
      return 'Domani';
    }

    return date.toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
  };

  const formatTime = (time: Date | string): string => {
    const date = typeof time === 'string' ? new Date(time) : time;
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const calculateDuration = (startTime: Date | string, endTime: Date | string): string => {
    const start = typeof startTime === 'string' ? new Date(startTime) : startTime;
    const end = typeof endTime === 'string' ? new Date(endTime) : endTime;

    const durationMs = end.getTime() - start.getTime();
    const durationMinutes = Math.floor(durationMs / (1000 * 60));

    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;

    if (minutes === 0) {
      return `${hours}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className={styles.calendar}>
      {Array.from(shiftsByDate.entries()).map(([date, dayShifts]) => (
        <div key={date} className={styles.dayCard}>
          <div className={styles.dateHeader}>
            <Calendar size={18} />
            <span className={styles.dateText}>{formatDate(date)}</span>
            <span className={styles.dateSmall}>
              {new Date(date).toLocaleDateString('it-IT', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })}
            </span>
          </div>

          <div className={styles.shifts}>
            {dayShifts.map((shift) => (
              <div key={shift.id} className={styles.shiftCard}>
                <div className={styles.shiftHeader}>
                  <span className={styles.phaseName}>{shift.phaseName}</span>
                  <span className={styles.duration}>
                    {calculateDuration(shift.startTime, shift.endTime)}
                  </span>
                </div>

                <div className={styles.shiftDetails}>
                  <div className={styles.detailRow}>
                    <Clock size={14} />
                    <span>
                      {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

