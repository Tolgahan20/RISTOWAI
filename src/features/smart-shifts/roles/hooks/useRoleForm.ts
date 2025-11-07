import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '../api';
import { useNotificationStore } from '@/features/smart-shifts/common/stores/notification';
import type { Role, CreateRoleRequest } from '../types';

export const useRoleForm = (role?: Role) => {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  const [formData, setFormData] = useState<CreateRoleRequest>({
    name: role?.name || '',
    description: role?.description || '',
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateRoleRequest) => rolesApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      showNotification({ message: 'Ruolo creato con successo', type: 'success' });
    },
    onError: () => {
      showNotification({ message: 'Errore nella creazione del ruolo', type: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateRoleRequest) => rolesApi.update(role!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
      showNotification({ message: 'Ruolo aggiornato con successo', type: 'success' });
    },
    onError: () => {
      showNotification({ message: 'Errore nell\'aggiornamento del ruolo', type: 'error' });
    },
  });

  const updateField = (field: keyof CreateRoleRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.name.trim()) {
      showNotification({ message: 'Il nome del ruolo è obbligatorio', type: 'error' });
      return;
    }

    if (role) {
      await updateMutation.mutateAsync(formData);
    } else {
      await createMutation.mutateAsync(formData);
    }
  };

  return {
    formData,
    updateField,
    handleSubmit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
};

