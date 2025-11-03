import type { OpeningHours } from '../types';

/**
 * Format opening hours from internal format (with siesta) to backend format
 * Combines lunch and dinner shifts into a single open/close time
 */
export function formatOpeningHoursForBackend(openingHours: any): OpeningHours {
  const formattedHours: Partial<OpeningHours> = {};
  
  Object.keys(openingHours).forEach((day) => {
    const dayData = openingHours[day];
    if (dayData) {
      (formattedHours as any)[day] = {
        open: dayData.open || dayData.eveningOpen,
        close: dayData.eveningClose || dayData.close,
      };
    }
  });

  return formattedHours as OpeningHours;
}

/**
 * Toggle a day in the opening hours object
 * If the day exists, remove it. If it doesn't exist, add it with default values.
 */
export function toggleDayInOpeningHours(
  openingHours: any,
  day: string,
  defaultValues = { open: '12:00', close: '15:00', eveningOpen: '19:00', eveningClose: '23:00' }
): any {
  if (openingHours[day]) {
    const newHours = { ...openingHours };
    delete newHours[day];
    return newHours;
  } else {
    return {
      ...openingHours,
      [day]: defaultValues,
    };
  }
}

/**
 * Update a specific field for a day in opening hours
 */
export function updateDayField(
  openingHours: any,
  day: string,
  field: string,
  value: string
): any {
  return {
    ...openingHours,
    [day]: {
      ...openingHours[day],
      [field]: value,
    },
  };
}

