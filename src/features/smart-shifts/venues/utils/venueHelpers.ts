import type { OpeningHours, DayOfWeek } from '../types';
import { DAYS_OF_WEEK } from '../types';

/**
 * Day labels in Italian
 */
const DAY_LABELS: Record<DayOfWeek, string> = {
  monday: 'Lunedì',
  tuesday: 'Martedì',
  wednesday: 'Mercoledì',
  thursday: 'Giovedì',
  friday: 'Venerdì',
  saturday: 'Sabato',
  sunday: 'Domenica',
};

/**
 * Format a date using Italian locale
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('it-IT', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format opening hours for display
 * Returns an array of {day, label, hours} objects
 */
export function formatOpeningHoursForDisplay(openingHours?: OpeningHours) {
  if (!openingHours) return [];

  return DAYS_OF_WEEK.map((day) => {
    const hours = openingHours[day as keyof OpeningHours];
    return {
      day: day,
      label: DAY_LABELS[day],
      hours: hours ? `${hours.open} - ${hours.close}` : 'Chiuso',
      isOpen: !!hours,
    };
  });
}

/**
 * Get a summary of opening hours (first open day)
 */
export function getOpeningHoursSummary(openingHours?: OpeningHours): string {
  if (!openingHours) {
    return 'Orari non impostati';
  }

  // Find first day with hours
  for (const day of DAYS_OF_WEEK) {
    const hours = openingHours[day as keyof OpeningHours];
    if (hours) {
      return `${hours.open} - ${hours.close}`;
    }
  }

  return 'Orari non impostati';
}

/**
 * Get count of open days
 */
export function getOpenDaysCount(openingHours?: OpeningHours): number {
  if (!openingHours) return 0;
  
  let count = 0;
  for (const day of DAYS_OF_WEEK) {
    if (openingHours[day as keyof OpeningHours]) {
      count++;
    }
  }
  return count;
}

/**
 * Get staff member display name
 */
export function getStaffDisplayName(staff: { firstName?: string; lastName?: string }): string {
  const firstName = staff.firstName || 'N/A';
  const lastName = staff.lastName || '';
  return `${firstName} ${lastName}`.trim();
}

