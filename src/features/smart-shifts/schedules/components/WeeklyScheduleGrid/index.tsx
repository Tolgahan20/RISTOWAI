'use client';

import { useMemo } from 'react';
import type { WeeklySchedule, StaffColor, Shift } from '../../types';
import {
  generateCalendarDays,
  getHourRange,
  isShiftInTimeSlot,
  formatTime,
} from '../../utils/scheduleHelpers';
import { generateStaffColors, getStaffColor, hexToRgba } from '../../utils/colorHelpers';
import styles from './weekly-schedule-grid.module.css';

interface WeeklyScheduleGridProps {
  schedule: WeeklySchedule;
}

export function WeeklyScheduleGrid({ schedule }: WeeklyScheduleGridProps) {
  // Generate staff colors
  const staffColors = useMemo(() => {
    const staffIds = schedule.shifts.map((s) => s.staffId);
    return generateStaffColors(staffIds);
  }, [schedule.shifts]);

  // Generate calendar days
  const calendarDays = useMemo(() => {
    return generateCalendarDays(schedule.startDate, schedule.shifts);
  }, [schedule.startDate, schedule.shifts]);

  // Get hour range
  const { min: minHour, max: maxHour } = useMemo(() => {
    return getHourRange(schedule.shifts);
  }, [schedule.shifts]);

  // Generate hours array
  const hours = useMemo(() => {
    const result = [];
    for (let i = minHour; i <= maxHour; i++) {
      result.push(i);
    }
    return result;
  }, [minHour, maxHour]);

  const renderShiftCell = (shift: Shift, staffColors: StaffColor[]) => {
    const color = getStaffColor(shift.staffId, staffColors);
    const backgroundColor = hexToRgba(color, 0.15);
    const borderColor = color;

    return (
      <div
        key={shift.id}
        className={styles.shiftCell}
        style={{
          backgroundColor,
          borderLeft: `3px solid ${borderColor}`,
        }}
        title={`${shift.staffName} - ${shift.phaseName || ''}\n${formatTime(shift.startTime)} - ${formatTime(shift.endTime)}`}
      >
        <div className={styles.shiftStaff}>{shift.staffName}</div>
        {shift.phaseName && <div className={styles.shiftPhase}>{shift.phaseName}</div>}
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {/* Header Row - Days */}
        <div className={styles.headerRow}>
          <div className={styles.timeHeader}>Ora</div>
          {calendarDays.map((day) => (
            <div key={day.date} className={styles.dayHeader}>
              <div className={styles.dayName}>{day.dayName}</div>
              <div className={styles.dayDate}>
                {new Date(day.date).getDate()}
              </div>
            </div>
          ))}
        </div>

        {/* Time Rows */}
        {hours.map((hour) => (
          <div key={hour} className={styles.timeRow}>
            <div className={styles.timeLabel}>
              {hour.toString().padStart(2, '0')}:00
            </div>
            {calendarDays.map((day) => {
              const shiftsInSlot = day.shifts.filter((shift) =>
                isShiftInTimeSlot(shift, hour),
              );

              return (
                <div key={`${day.date}-${hour}`} className={styles.timeCell}>
                  {shiftsInSlot.map((shift) =>
                    renderShiftCell(shift, staffColors),
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        <div className={styles.legendTitle}>Staff</div>
        <div className={styles.legendItems}>
          {staffColors.map((sc) => {
            const staff = schedule.shifts.find((s) => s.staffId === sc.staffId);
            return (
              <div key={sc.staffId} className={styles.legendItem}>
                <div
                  className={styles.legendColor}
                  style={{ backgroundColor: sc.color }}
                />
                <span>{staff?.staffName}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

