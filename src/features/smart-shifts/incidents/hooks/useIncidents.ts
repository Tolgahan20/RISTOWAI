import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentsApi } from '../api/incidentsApi';
import { useNotificationStore } from '../../common/stores/notification';
import { INCIDENT_MESSAGES } from '../../common/constants/messages';
import type {
  PaginatedIncidentsQuery,
  CreateIncidentRequest,
  UpdateIncidentRequest,
  ResolveIncidentRequest,
} from '../types';

/**
 * Get all incidents with pagination and filters
 */
export const useIncidents = (query: PaginatedIncidentsQuery) => {
  return useQuery({
    queryKey: ['incidents', query],
    queryFn: () => incidentsApi.getIncidents(query),
    enabled: !!query.venueId, // Only fetch if venueId is provided
  });
};

/**
 * Get incident by ID
 */
export const useIncident = (id: string) => {
  return useQuery({
    queryKey: ['incidents', id],
    queryFn: () => incidentsApi.getIncident(id),
    enabled: !!id,
  });
};

/**
 * Get incident statistics
 */
export const useIncidentStats = (
  venueId: string,
  startDate?: string,
  endDate?: string,
) => {
  return useQuery({
    queryKey: ['incidents', 'stats', venueId, startDate, endDate],
    queryFn: () => incidentsApi.getStats(venueId, startDate, endDate),
    enabled: !!venueId,
  });
};

/**
 * Create incident mutation
 */
export const useCreateIncident = () => {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  return useMutation({
    mutationFn: (data: CreateIncidentRequest) =>
      incidentsApi.createIncident(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      showNotification({
        type: 'success',
        message: INCIDENT_MESSAGES.create.success,
      });
    },
    onError: () => {
      showNotification({
        type: 'error',
        message: INCIDENT_MESSAGES.create.error,
      });
    },
  });
};

/**
 * Update incident mutation
 */
export const useUpdateIncident = () => {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateIncidentRequest }) =>
      incidentsApi.updateIncident(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['incidents', variables.id] });
      showNotification({
        type: 'success',
        message: INCIDENT_MESSAGES.update.success,
      });
    },
    onError: () => {
      showNotification({
        type: 'error',
        message: INCIDENT_MESSAGES.update.error,
      });
    },
  });
};

/**
 * Resolve incident mutation
 */
export const useResolveIncident = () => {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ResolveIncidentRequest }) =>
      incidentsApi.resolveIncident(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['incidents', variables.id] });
      showNotification({
        type: 'success',
        message: INCIDENT_MESSAGES.resolve.success,
      });
    },
    onError: () => {
      showNotification({
        type: 'error',
        message: INCIDENT_MESSAGES.resolve.error,
      });
    },
  });
};

/**
 * Close incident mutation
 */
export const useCloseIncident = () => {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  return useMutation({
    mutationFn: (id: string) => incidentsApi.closeIncident(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['incidents', id] });
      showNotification({
        type: 'success',
        message: INCIDENT_MESSAGES.close.success,
      });
    },
    onError: () => {
      showNotification({
        type: 'error',
        message: INCIDENT_MESSAGES.close.error,
      });
    },
  });
};

/**
 * Delete incident mutation
 */
export const useDeleteIncident = () => {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore(
    (state) => state.showNotification,
  );

  return useMutation({
    mutationFn: (id: string) => incidentsApi.deleteIncident(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      showNotification({
        type: 'success',
        message: INCIDENT_MESSAGES.delete.success,
      });
    },
    onError: () => {
      showNotification({
        type: 'error',
        message: INCIDENT_MESSAGES.delete.error,
      });
    },
  });
};

