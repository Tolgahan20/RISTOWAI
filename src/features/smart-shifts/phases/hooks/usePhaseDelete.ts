import { useMutation, useQueryClient } from '@tanstack/react-query';
import { phasesApi } from '../api';
import { useNotificationStore } from '@/features/smart-shifts/common/stores/notification';

export const usePhaseDelete = (venueId: string) => {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  const deleteMutation = useMutation({
    mutationFn: (phaseId: string) => phasesApi.delete(venueId, phaseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phases', venueId] });
      showNotification({ message: 'Fase eliminata con successo', type: 'success' });
    },
    onError: () => {
      showNotification({ message: 'Errore nell\'eliminazione della fase', type: 'error' });
    },
  });

  return {
    handleDelete: (phaseId: string) => deleteMutation.mutate(phaseId),
    isDeleting: deleteMutation.isPending,
  };
};

