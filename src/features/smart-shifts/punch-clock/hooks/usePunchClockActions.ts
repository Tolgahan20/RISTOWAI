import { useMutation, useQueryClient } from '@tanstack/react-query';
import { punchClockApi } from '../api';
import type {
  ClockInRequest,
  ClockOutRequest,
  ResolveAnomalyRequest,
} from '../types';

export const usePunchClockActions = () => {
  const queryClient = useQueryClient();

  const clockIn = useMutation({
    mutationFn: (data: ClockInRequest) => punchClockApi.clockIn(data),
    onSuccess: (_, variables) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ['timeEvents', variables.staffId, variables.venueId],
      });
    },
  });

  const clockOut = useMutation({
    mutationFn: (data: ClockOutRequest) => punchClockApi.clockOut(data),
    onSuccess: (_, variables) => {
      // Invalidate queries to refresh data
      queryClient.invalidateQueries({
        queryKey: ['timeEvents', variables.staffId, variables.venueId],
      });
    },
  });

  const resolveAnomaly = useMutation({
    mutationFn: ({
      eventId,
      data,
    }: {
      eventId: string;
      data: ResolveAnomalyRequest;
    }) => punchClockApi.resolveAnomaly(eventId, data),
    onSuccess: () => {
      // Invalidate anomalies queries
      queryClient.invalidateQueries({ queryKey: ['anomalies'] });
      queryClient.invalidateQueries({ queryKey: ['timeEvents'] });
    },
  });

  return {
    clockIn,
    clockOut,
    resolveAnomaly,
  };
};

