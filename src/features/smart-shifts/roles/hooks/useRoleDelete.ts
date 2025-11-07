import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '../api';
import { useNotificationStore } from '@/features/smart-shifts/common/stores/notification';

export const useRoleDelete = () => {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => rolesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      showNotification({ message: 'Ruolo eliminato con successo', type: 'success' });
    },
    onError: () => {
      showNotification({ message: 'Errore nell\'eliminazione del ruolo', type: 'error' });
    },
  });

  return {
    handleDelete: (id: string) => deleteMutation.mutate(id),
    isDeleting: deleteMutation.isPending,
  };
};

