import { useMutation, useQueryClient } from '@tanstack/react-query';
import { requestsApi } from '../api';
import { useNotificationStore } from '../../common/stores/notification';
import { REQUEST_MESSAGES } from '../../common/constants/messages';
import type { ReviewRequestRequest } from '../types';

interface UseRequestActionsProps {
  venueId: string;
}

export const useRequestActions = ({ venueId }: UseRequestActionsProps) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();

  const approveMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data?: ReviewRequestRequest }) =>
      requestsApi.approve(venueId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests', venueId] });
      queryClient.invalidateQueries({ queryKey: ['requestStats', venueId] });
      showNotification({
        type: 'success',
        message: REQUEST_MESSAGES.approve.success,
      });
    },
    onError: () => {
      showNotification({
        type: 'error',
        message: REQUEST_MESSAGES.approve.error,
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data?: ReviewRequestRequest }) =>
      requestsApi.reject(venueId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests', venueId] });
      queryClient.invalidateQueries({ queryKey: ['requestStats', venueId] });
      showNotification({
        type: 'success',
        message: REQUEST_MESSAGES.reject.success,
      });
    },
    onError: () => {
      showNotification({
        type: 'error',
        message: REQUEST_MESSAGES.reject.error,
      });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => requestsApi.cancel(venueId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests', venueId] });
      queryClient.invalidateQueries({ queryKey: ['requestStats', venueId] });
      showNotification({
        type: 'success',
        message: REQUEST_MESSAGES.cancel.success,
      });
    },
    onError: () => {
      showNotification({
        type: 'error',
        message: REQUEST_MESSAGES.cancel.error,
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => requestsApi.delete(venueId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['requests', venueId] });
      queryClient.invalidateQueries({ queryKey: ['requestStats', venueId] });
      showNotification({
        type: 'success',
        message: REQUEST_MESSAGES.delete.success,
      });
    },
    onError: () => {
      showNotification({
        type: 'error',
        message: REQUEST_MESSAGES.delete.error,
      });
    },
  });

  const handleApprove = (id: string, data?: ReviewRequestRequest) => {
    approveMutation.mutate({ id, data });
  };

  const handleReject = (id: string, data?: ReviewRequestRequest) => {
    rejectMutation.mutate({ id, data });
  };

  const handleCancel = (id: string) => {
    cancelMutation.mutate(id);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  return {
    handleApprove,
    handleReject,
    handleCancel,
    handleDelete,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
    isCancelling: cancelMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
};

