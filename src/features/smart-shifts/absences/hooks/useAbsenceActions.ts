import { useMutation, useQueryClient } from '@tanstack/react-query';
import { absencesApi } from '../api';
import { useNotificationStore } from '@/features/smart-shifts/common/stores/notification';
import type { ApproveAbsenceRequest } from '../types';

export const useAbsenceActions = (venueId: string) => {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => absencesApi.delete(venueId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences', venueId] });
      // Also invalidate balance cache
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      showNotification({ message: 'Assenza eliminata con successo', type: 'success' });
    },
    onError: () => {
      showNotification({ message: 'Errore nell\'eliminazione dell\'assenza', type: 'error' });
    },
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data?: ApproveAbsenceRequest }) =>
      absencesApi.approve(venueId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences', venueId] });
      // Invalidate balance cache after approval
      queryClient.invalidateQueries({ queryKey: ['balances'] });
      showNotification({ message: 'Assenza approvata con successo', type: 'success' });
    },
    onError: () => {
      showNotification({ message: 'Errore nell\'approvazione dell\'assenza', type: 'error' });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data?: ApproveAbsenceRequest }) =>
      absencesApi.reject(venueId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences', venueId] });
      showNotification({ message: 'Assenza rifiutata con successo', type: 'success' });
    },
    onError: () => {
      showNotification({ message: 'Errore nel rifiuto dell\'assenza', type: 'error' });
    },
  });

  return {
    handleDelete: (id: string) => deleteMutation.mutate(id),
    handleApprove: (id: string, data?: ApproveAbsenceRequest) => approveMutation.mutate({ id, data }),
    handleReject: (id: string, data?: ApproveAbsenceRequest) => rejectMutation.mutate({ id, data }),
    isDeleting: deleteMutation.isPending,
    isApproving: approveMutation.isPending,
    isRejecting: rejectMutation.isPending,
  };
};
