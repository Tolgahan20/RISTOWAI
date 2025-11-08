import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { weeklyAdminApi } from '../api/weeklyAdminApi';
import { useNotificationStore } from '../../common/stores/notification';
import { WEEKLY_ADMIN_MESSAGES } from '../../common/constants/messages';
import type {
  ResolveAnomalyRequest,
  ApproveExtraHoursRequest,
  LockWeekRequest,
} from '../types';

export * from './useAnomaliesSection';
export * from './useExtraHoursSection';
export * from './useWeekSelector';

/**
 * Get weekly admin data
 */
export const useWeeklyAdminData = (venueId: string, weekStartDate: string) => {
  return useQuery({
    queryKey: ['weeklyAdmin', venueId, weekStartDate],
    queryFn: () => weeklyAdminApi.getWeeklyData(venueId, weekStartDate),
    enabled: !!venueId && !!weekStartDate,
  });
};

/**
 * Resolve anomaly mutation
 */
export const useResolveAnomaly = () => {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  return useMutation({
    mutationFn: ({
      venueId,
      timeEventId,
      data,
    }: {
      venueId: string;
      timeEventId: string;
      data: ResolveAnomalyRequest;
    }) => weeklyAdminApi.resolveAnomaly(venueId, timeEventId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['weeklyAdmin', variables.venueId] });
      showNotification({
        type: 'success',
        message: WEEKLY_ADMIN_MESSAGES.anomaly.resolve.success,
      });
    },
    onError: () => {
      showNotification({
        type: 'error',
        message: WEEKLY_ADMIN_MESSAGES.anomaly.resolve.error,
      });
    },
  });
};

/**
 * Approve extra hours mutation
 */
export const useApproveExtraHours = () => {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  return useMutation({
    mutationFn: ({
      venueId,
      data,
    }: {
      venueId: string;
      data: ApproveExtraHoursRequest;
    }) => weeklyAdminApi.approveExtraHours(venueId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['weeklyAdmin', variables.venueId] });
      showNotification({
        type: 'success',
        message: WEEKLY_ADMIN_MESSAGES.extraHours.approve.success,
      });
    },
    onError: () => {
      showNotification({
        type: 'error',
        message: WEEKLY_ADMIN_MESSAGES.extraHours.approve.error,
      });
    },
  });
};

/**
 * Lock week mutation
 */
export const useLockWeek = () => {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  return useMutation({
    mutationFn: ({ venueId, data }: { venueId: string; data: LockWeekRequest }) =>
      weeklyAdminApi.lockWeek(venueId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['weeklyAdmin', variables.venueId] });
      showNotification({
        type: 'success',
        message: WEEKLY_ADMIN_MESSAGES.lock.success,
      });
    },
    onError: () => {
      showNotification({
        type: 'error',
        message: WEEKLY_ADMIN_MESSAGES.lock.error,
      });
    },
  });
};

/**
 * Unlock week mutation
 */
export const useUnlockWeek = () => {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  return useMutation({
    mutationFn: ({ venueId, weekStartDate }: { venueId: string; weekStartDate: string }) =>
      weeklyAdminApi.unlockWeek(venueId, weekStartDate),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['weeklyAdmin', variables.venueId] });
      showNotification({
        type: 'success',
        message: WEEKLY_ADMIN_MESSAGES.unlock.success,
      });
    },
    onError: () => {
      showNotification({
        type: 'error',
        message: WEEKLY_ADMIN_MESSAGES.unlock.error,
      });
    },
  });
};

