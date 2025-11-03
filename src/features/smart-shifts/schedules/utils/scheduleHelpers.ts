import type { Shift, CalendarDay, TimeSlot } from '../types';
import { formatTime as formatTimeCommon, formatShortDate } from '../../common/utils/dateHelpers';

/**
 * Group shifts by day
 */
export const groupShiftsByDay = (shifts: Shift[]): Map<string, Shift[]> => {
  const dayMap = new Map<string, Shift[]>();

  shifts.forEach((shift) => {
    const date = new Date(shift.startTime).toISOString().split('T')[0];
    const existingShifts = dayMap.get(date) || [];
    dayMap.set(date, [...existingShifts, shift]);
  });

  return dayMap;
};

/**
 * Generate calendar days for a week
 */
export const generateCalendarDays = (
  startDate: string,
  shifts: Shift[],
): CalendarDay[] => {
  const start = new Date(startDate);
  const days: CalendarDay[] = [];
  const shiftsByDay = groupShiftsByDay(shifts);

  const dayNames = ['Dom', 'Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab'];

  for (let i = 0; i < 7; i++) {
    const date = new Date(start);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayShifts = shiftsByDay.get(dateStr) || [];

    days.push({
      date: dateStr,
      dayName: dayNames[date.getDay()],
      shifts: dayShifts,
    });
  }

  return days;
};

/**
 * Group shifts by time slots (hourly)
 */
export const groupShiftsByTimeSlot = (shifts: Shift[]): TimeSlot[] => {
  const timeSlotMap = new Map<number, Shift[]>();

  shifts.forEach((shift) => {
    const startHour = new Date(shift.startTime).getHours();
    const endHour = new Date(shift.endTime).getHours();

    // Add shift to all hours it spans
    for (let hour = startHour; hour <= endHour; hour++) {
      const existingShifts = timeSlotMap.get(hour) || [];
      if (!existingShifts.find((s) => s.id === shift.id)) {
        timeSlotMap.set(hour, [...existingShifts, shift]);
      }
    }
  });

  // Convert to array and sort by hour
  return Array.from(timeSlotMap.entries())
    .map(([hour, shifts]) => ({ hour, shifts }))
    .sort((a, b) => a.hour - b.hour);
};

/**
 * Check if a shift overlaps with a time slot
 */
export const isShiftInTimeSlot = (shift: Shift, hour: number): boolean => {
  const startHour = new Date(shift.startTime).getHours();
  const endHour = new Date(shift.endTime).getHours();
  return hour >= startHour && hour <= endHour;
};

/**
 * Format time from ISO string
 * Uses common date helper
 */
export const formatTime = (isoString: string): string => {
  return formatTimeCommon(isoString);
};

/**
 * Format date
 * Uses common date helper
 */
export const formatDate = (isoString: string): string => {
  return formatShortDate(isoString);
};

/**
 * Calculate shift duration in hours
 */
export const calculateShiftDuration = (shift: Shift): number => {
  const start = new Date(shift.startTime);
  const end = new Date(shift.endTime);
  return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
};

/**
 * Get the range of hours covered by shifts
 */
export const getHourRange = (shifts: Shift[]): { min: number; max: number } => {
  if (shifts.length === 0) return { min: 7, max: 23 }; // Default business hours

  const hours = shifts.flatMap((shift) => [
    new Date(shift.startTime).getHours(),
    new Date(shift.endTime).getHours(),
  ]);

  return {
    min: Math.max(0, Math.min(...hours) - 1), // Add padding
    max: Math.min(23, Math.max(...hours) + 1),
  };
};

