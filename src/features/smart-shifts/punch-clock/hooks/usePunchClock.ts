import { useQuery } from '@tanstack/react-query';
import { punchClockApi } from '../api';
import type {  PunchClockStatus } from '../types';

/**
 * Hook to get time events for a staff member
 */
export const useTimeEvents = (
  staffId: string,
  venueId: string,
  startDate?: string,
  endDate?: string,
) => {
  return useQuery({
    queryKey: ['timeEvents', staffId, venueId, startDate, endDate],
    queryFn: () =>
      punchClockApi.getTimeEvents(staffId, venueId, startDate, endDate),
    enabled: !!staffId && !!venueId,
  });
};

/**
 * Hook to get unresolved anomalies for a venue (manager view)
 */
export const useUnresolvedAnomalies = (venueId: string) => {
  return useQuery({
    queryKey: ['anomalies', venueId],
    queryFn: () => punchClockApi.getUnresolvedAnomalies(venueId),
    enabled: !!venueId,
  });
};

/**
 * Hook to get current punch clock status for a staff member
 */
export const usePunchClockStatus = (
  staffId: string,
  venueId: string,
): { data?: PunchClockStatus; isLoading: boolean; error: Error | null } => {
  const { data: events, isLoading, error } = useTimeEvents(staffId, venueId);

  const status: PunchClockStatus = {
    isClockedIn: false,
    lastEvent: undefined,
  };

  if (events && events.length > 0) {
    const sortedEvents = [...events].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
    );
    status.lastEvent = sortedEvents[0];
    status.isClockedIn = sortedEvents[0].kind === 'IN';
  }

  return {
    data: status,
    isLoading,
    error,
  };
};

