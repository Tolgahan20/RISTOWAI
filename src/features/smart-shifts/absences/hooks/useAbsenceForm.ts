import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { absencesApi } from '../api';
import { useNotificationStore } from '@/features/smart-shifts/common/stores/notification';
import type { Absence, CreateAbsenceRequest, AbsenceCode } from '../types';

export const useAbsenceForm = (venueId: string, absence?: Absence) => {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  const [formData, setFormData] = useState<CreateAbsenceRequest>({
    staffId: absence?.staffId || '',
    startDate: absence?.startDate || '',
    endDate: absence?.endDate || '',
    reason: absence?.reason || '',
    absenceCode: absence?.absenceCode,
    hoursOptional: absence?.hoursOptional,
    documentReference: absence?.documentReference || '',
    managerNotes: absence?.managerNotes || '',
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateAbsenceRequest) => absencesApi.create(venueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences', venueId] });
      showNotification({ message: 'Assenza creata con successo', type: 'success' });
    },
    onError: () => {
      showNotification({ message: 'Errore nella creazione dell\'assenza', type: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: CreateAbsenceRequest) => absencesApi.update(venueId, absence!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['absences', venueId] });
      showNotification({ message: 'Assenza aggiornata con successo', type: 'success' });
    },
    onError: () => {
      showNotification({ message: 'Errore nell\'aggiornamento dell\'assenza', type: 'error' });
    },
  });

  const updateField = (field: keyof CreateAbsenceRequest, value: string | number | AbsenceCode | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.staffId || !formData.startDate || !formData.endDate || !formData.reason) {
      showNotification({ message: 'Compila tutti i campi obbligatori', type: 'error' });
      return;
    }

    // Validate dates
    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      showNotification({ message: 'La data di fine deve essere successiva alla data di inizio', type: 'error' });
      return;
    }

    if (absence) {
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

