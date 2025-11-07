import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { phasesApi } from '../api';
import { useNotificationStore } from '@/features/smart-shifts/common/stores/notification';
import type { Phase, CreatePhaseRequest, UpdatePhaseRequest, PhaseType } from '../types';

export const usePhaseForm = (venueId: string, phase?: Phase) => {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  // Helper to normalize roleRequirements from backend
  const normalizeRoleRequirements = (reqs: any[]): Array<{ role: string; minStaff: number; maxStaff?: number }> => {
    if (!reqs || !Array.isArray(reqs)) return [];
    return reqs.map(req => {
      // If it's already an object with the right structure
      if (typeof req === 'object' && req.role) {
        return {
          role: req.role,
          minStaff: req.minStaff || 1,
          maxStaff: req.maxStaff
        };
      }
      // If it's just a string (fallback)
      if (typeof req === 'string') {
        return { role: req, minStaff: 1, maxStaff: undefined };
      }
      return { role: '', minStaff: 1, maxStaff: undefined };
    });
  };

  // Helper to normalize daysOfWeek from backend
  const normalizeDaysOfWeek = (days: any): number[] => {
    if (!days || !Array.isArray(days)) return [];
    return days.map(day => {
      // If it's already a number, use it
      if (typeof day === 'number') return day;
      // If it's a string like "monday", convert to number
      const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
      const index = dayNames.indexOf(day.toLowerCase());
      return index >= 0 ? index : 0;
    }).filter(day => day >= 0 && day <= 6);
  };

  const [formData, setFormData] = useState<CreatePhaseRequest>({
    name: phase?.name || '',
    startTime: phase?.startTime || '12:00',
    endTime: phase?.endTime || '15:00',
    type: phase?.type || ('SOFT' as PhaseType),
    roleRequirements: normalizeRoleRequirements(phase?.roleRequirements || []),
    daysOfWeek: normalizeDaysOfWeek(phase?.daysOfWeek || []),
    notes: phase?.notes || '',
    priority: phase?.priority || 0,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreatePhaseRequest) => phasesApi.create(venueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phases', venueId] });
      showNotification({ message: 'Fase creata con successo', type: 'success' });
    },
    onError: () => {
      showNotification({ message: 'Errore nella creazione della fase', type: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UpdatePhaseRequest) => phasesApi.update(venueId, phase!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['phases', venueId] });
      showNotification({ message: 'Fase aggiornata con successo', type: 'success' });
    },
    onError: () => {
      showNotification({ message: 'Errore nell\'aggiornamento della fase', type: 'error' });
    },
  });

  const updateField = (field: keyof CreatePhaseRequest, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Validate and clean data before submission
    const dataToSubmit = {
      ...formData,
      startTime: formData.startTime.substring(0, 5), // Remove seconds (HH:mm:ss -> HH:mm)
      endTime: formData.endTime.substring(0, 5),     // Remove seconds
      // Ensure roleRequirements are proper objects
      roleRequirements: formData.roleRequirements.map(req => ({
        role: req.role,
        minStaff: Number(req.minStaff) || 1,
        ...(req.maxStaff !== undefined && { maxStaff: Number(req.maxStaff) })
      })),
      // Ensure daysOfWeek are numbers
      daysOfWeek: (formData.daysOfWeek || []).map(day => Number(day)).filter(day => day >= 0 && day <= 6),
      // Ensure priority is a number
      priority: Number(formData.priority) || 0
    };

    if (phase) {
      await updateMutation.mutateAsync(dataToSubmit);
    } else {
      await createMutation.mutateAsync(dataToSubmit);
    }
  };

  return {
    formData,
    updateField,
    handleSubmit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
  };
};

