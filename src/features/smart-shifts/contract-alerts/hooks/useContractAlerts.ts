import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as contractAlertsApi from '../api/contractAlertsApi';
import type { AlertStatus } from '@/types/contract-alerts';

/**
 * Query keys for contract alerts
 */
export const contractAlertsKeys = {
  all: ['contractAlerts'] as const,
  byVenue: (venueId: string) => ['contractAlerts', 'venue', venueId] as const,
  byVenueWithStatus: (venueId: string, status?: AlertStatus) =>
    ['contractAlerts', 'venue', venueId, status] as const,
  pendingCount: (venueId: string) =>
    ['contractAlerts', 'venue', venueId, 'count'] as const,
};

/**
 * Hook to fetch contract alerts for a venue
 */
export const useContractAlerts = (venueId: string, status?: AlertStatus) => {
  return useQuery({
    queryKey: contractAlertsKeys.byVenueWithStatus(venueId, status),
    queryFn: () => contractAlertsApi.getVenueAlerts(venueId, status),
    enabled: !!venueId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

/**
 * Hook to fetch pending alerts count for a venue
 */
export const usePendingAlertsCount = (venueId: string) => {
  return useQuery({
    queryKey: contractAlertsKeys.pendingCount(venueId),
    queryFn: () => contractAlertsApi.getVenuePendingCount(venueId),
    enabled: !!venueId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

/**
 * Hook to acknowledge an alert
 */
export const useAcknowledgeAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractAlertsApi.acknowledgeAlert,
    onSuccess: (data) => {
      // Invalidate all contract alerts queries for the venue
      queryClient.invalidateQueries({
        queryKey: contractAlertsKeys.byVenue(data.venueId),
      });
    },
  });
};

/**
 * Hook to resolve an alert
 */
export const useResolveAlert = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractAlertsApi.resolveAlert,
    onSuccess: (data) => {
      // Invalidate all contract alerts queries for the venue
      queryClient.invalidateQueries({
        queryKey: contractAlertsKeys.byVenue(data.venueId),
      });
    },
  });
};

/**
 * Hook to trigger manual check
 */
export const useTriggerManualCheck = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: contractAlertsApi.triggerManualCheck,
    onSuccess: () => {
      // Invalidate all contract alerts queries
      queryClient.invalidateQueries({
        queryKey: contractAlertsKeys.all,
      });
    },
  });
};

