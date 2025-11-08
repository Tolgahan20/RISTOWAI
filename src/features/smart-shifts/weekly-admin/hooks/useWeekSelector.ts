import { useState } from 'react';
import { getWeekStart, formatDateForAPI } from '../utils/weekHelpers';

export const useWeekSelector = (initialDate?: Date) => {
  const [selectedWeek, setSelectedWeek] = useState(getWeekStart(initialDate || new Date()));

  const weekStartDate = formatDateForAPI(selectedWeek);

  const goToPreviousWeek = () => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() - 7);
    setSelectedWeek(newDate);
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedWeek);
    newDate.setDate(newDate.getDate() + 7);
    setSelectedWeek(newDate);
  };

  const goToCurrentWeek = () => {
    setSelectedWeek(getWeekStart(new Date()));
  };

  return {
    selectedWeek,
    weekStartDate,
    setSelectedWeek,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
  };
};

