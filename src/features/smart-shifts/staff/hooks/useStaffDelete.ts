import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '../api';
import { useNotificationStore } from '../../common/stores/notification';
import { STAFF_MESSAGES } from '../../common/constants/messages';

export const useStaffDelete = (venueId: string) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();

  const deleteMutation = useMutation({
    mutationFn: (staffId: string) => staffApi.deleteStaff(venueId, staffId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', venueId] });
      showNotification({ message: STAFF_MESSAGES.delete.success, type: 'success' });
    },
    onError: () => {
      showNotification({ message: STAFF_MESSAGES.delete.error, type: 'error' });
    },
  });

  const handleDelete = (staffId: string) => {
    deleteMutation.mutate(staffId);
  };

  return {
    handleDelete,
    isDeleting: deleteMutation.isPending,
  };
};

