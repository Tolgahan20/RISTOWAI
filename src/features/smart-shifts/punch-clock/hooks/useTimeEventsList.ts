import { useState } from 'react';
import { useTimeEvents } from './usePunchClock';

export const useTimeEventsList = (staffId: string, venueId: string) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const { data: events, isLoading, error } = useTimeEvents(
    staffId,
    venueId,
    startDate,
    endDate,
  );

  return {
    events,
    isLoading,
    error,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  };
};

