import { useState } from 'react';

/**
 * Hook for managing week navigation in the schedule view
 */
export function useWeekNavigation() {
  // Initialize with current week's Monday
  const [currentWeekStart, setCurrentWeekStart] = useState<string>(() => {
    return getMonday(new Date());
  });

  const goToPreviousWeek = () => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() - 7);
    setCurrentWeekStart(date.toISOString().split('T')[0]);
  };

  const goToNextWeek = () => {
    const date = new Date(currentWeekStart);
    date.setDate(date.getDate() + 7);
    setCurrentWeekStart(date.toISOString().split('T')[0]);
  };

  const goToCurrentWeek = () => {
    setCurrentWeekStart(getMonday(new Date()));
  };

  return {
    currentWeekStart,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
  };
}

/**
 * Get the Monday of a given week
 */
function getMonday(date: Date): string {
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
  const monday = new Date(date.setDate(diff));
  return monday.toISOString().split('T')[0];
}

