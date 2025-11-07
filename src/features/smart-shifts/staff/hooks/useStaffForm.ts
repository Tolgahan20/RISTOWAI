import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { staffApi } from '../api';
import { useNotificationStore } from '../../common/stores/notification';
import { STAFF_MESSAGES } from '../../common/constants/messages';
import type { CreateStaffRequest, UpdateStaffRequest, Staff, ContractType } from '../types';

export const useStaffForm = (venueId: string, staff?: Staff) => {
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();
  const isEditMode = !!staff;

  const [formData, setFormData] = useState<Partial<CreateStaffRequest>>({
    venueMemberId: staff?.venueMemberId || '',
    staffRole: staff?.staffRole || '',
    contractType: staff?.contractType || 'FULL_TIME' as ContractType,
    weeklyHours: staff?.weeklyHours || 40,
    hourlyRate: staff?.hourlyRate || 0,
    ccnlLevel: staff?.ccnlLevel || '',
    iban: staff?.iban || '',
    codiceFiscale: staff?.codiceFiscale || '',
    birthDate: staff?.birthDate ? staff.birthDate.split('T')[0] : '',
    hireDate: staff?.hireDate ? staff.hireDate.split('T')[0] : new Date().toISOString().split('T')[0],
    endDate: staff?.endDate ? staff.endDate.split('T')[0] : '',
    skills: staff?.skills || [],
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateStaffRequest) => staffApi.createStaff(venueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', venueId] });
      showNotification({ message: STAFF_MESSAGES.create.success, type: 'success' });
    },
    onError: () => {
      showNotification({ message: STAFF_MESSAGES.create.error, type: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdateStaffRequest) => staffApi.updateStaff(venueId, staff!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['staff', venueId] });
      showNotification({ message: STAFF_MESSAGES.update.success, type: 'success' });
    },
    onError: () => {
      showNotification({ message: STAFF_MESSAGES.update.error, type: 'error' });
    },
  });

  const updateField = (field: keyof CreateStaffRequest, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills?.includes(skill)) {
      setFormData((prev) => ({ ...prev, skills: [...(prev.skills || []), skill] }));
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills?.filter((s) => s !== skill) || [],
    }));
  };

  const handleSubmit = async () => {
    // Validation
    if (!formData.staffRole) {
      showNotification({ message: 'Il ruolo è obbligatorio', type: 'error' });
      return;
    }
    if (!formData.contractType) {
      showNotification({ message: 'Il tipo di contratto è obbligatorio', type: 'error' });
      return;
    }
    if (!formData.weeklyHours || formData.weeklyHours <= 0) {
      showNotification({ message: 'Le ore settimanali devono essere maggiori di 0', type: 'error' });
      return;
    }
    if (formData.hourlyRate === undefined || formData.hourlyRate === null || formData.hourlyRate < 0) {
      showNotification({ message: 'La tariffa oraria deve essere maggiore o uguale a 0', type: 'error' });
      return;
    }
    if (!formData.hireDate) {
      showNotification({ message: 'La data di assunzione è obbligatoria', type: 'error' });
      return;
    }

    if (isEditMode) {
      // For update, exclude venueMemberId and ensure numbers are properly typed
      const updateData: UpdateStaffRequest = {
        staffRole: formData.staffRole,
        contractType: formData.contractType,
        weeklyHours: Number(formData.weeklyHours),
        hourlyRate: Number(formData.hourlyRate),
        ccnlLevel: formData.ccnlLevel || undefined,
        iban: formData.iban || undefined,
        codiceFiscale: formData.codiceFiscale || undefined,
        birthDate: formData.birthDate || undefined,
        hireDate: formData.hireDate,
        endDate: formData.endDate || undefined,
        skills: formData.skills,
      };
      await updateMutation.mutateAsync(updateData);
    } else {
      // For create, venueMemberId is required by the backend
      // Ensure numbers are properly typed
      const createData: CreateStaffRequest = {
        ...formData,
        venueMemberId: formData.venueMemberId || 'temp-member-id',
        weeklyHours: Number(formData.weeklyHours),
        hourlyRate: Number(formData.hourlyRate),
      } as CreateStaffRequest;
      await createMutation.mutateAsync(createData);
    }
  };

  return {
    formData,
    updateField,
    addSkill,
    removeSkill,
    handleSubmit,
    isLoading: createMutation.isPending || updateMutation.isPending,
    isEditMode,
  };
};

