import { useState, useEffect } from 'react';
import { usePunchClockStatus } from './usePunchClock';
import { usePunchClockActions } from './usePunchClockActions';

export const usePunchClockWidget = (staffId: string, venueId: string, shiftId?: string) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [notes, setNotes] = useState('');

  const { data: status, isLoading, error } = usePunchClockStatus(staffId, venueId);
  const { clockIn, clockOut } = usePunchClockActions();

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClockIn = async () => {
    try {
      await clockIn.mutateAsync({
        staffId,
        venueId,
        shiftId,
        notes: notes || undefined,
      });
      setNotes('');
    } catch (err) {
      console.error('Clock in failed:', err);
    }
  };

  const handleClockOut = async () => {
    try {
      await clockOut.mutateAsync({
        staffId,
        venueId,
        notes: notes || undefined,
      });
      setNotes('');
    } catch (err) {
      console.error('Clock out failed:', err);
    }
  };

  return {
    currentTime,
    notes,
    setNotes,
    status,
    isLoading,
    error,
    handleClockIn,
    handleClockOut,
    clockIn,
    clockOut,
  };
};

