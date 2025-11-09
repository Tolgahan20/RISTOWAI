import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import * as presetsApi from '../api/presets';
import { useNotificationStore } from '../../common/stores/notification';

export const usePhasePresets = (venueId?: string) => {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);
  const [selectedIndustry, setSelectedIndustry] = useState<string | null>(null);

  // Get available industry types
  const {
    data: industries,
    isLoading: industriesLoading,
    error: industriesError,
  } = useQuery({
    queryKey: ['phase-presets', 'industries'],
    queryFn: presetsApi.getIndustryTypes,
    staleTime: Infinity, // Industry types rarely change
  });

  // Get templates for selected industry
  const {
    data: templates,
    isLoading: templatesLoading,
    error: templatesError,
  } = useQuery({
    queryKey: ['phase-presets', 'templates', selectedIndustry],
    queryFn: () => presetsApi.getPresetTemplates(selectedIndustry!),
    enabled: !!selectedIndustry,
  });

  // Apply preset to venue
  const applyPresetMutation = useMutation({
    mutationFn: (data: { industryType: string; clearExisting?: boolean }) =>
      presetsApi.applyPresetToVenue(venueId!, data),
    onSuccess: () => {
      showNotification({
        type: 'success',
        message: 'Preset applicato con successo!',
      });
      
      // Invalidate phases query to refresh the list
      if (venueId) {
        queryClient.invalidateQueries({ queryKey: ['phases', venueId] });
      }
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        'Errore durante l\'applicazione del preset';
      showNotification({
        type: 'error',
        message,
      });
    },
  });

  const applyPreset = async (industryType: string, clearExisting = false) => {
    if (!venueId) {
      showNotification({
        type: 'error',
        message: 'Nessun locale selezionato',
      });
      return;
    }

    try {
      await applyPresetMutation.mutateAsync({ industryType, clearExisting });
    } catch (error) {
      // Error already handled in onError
    }
  };

  return {
    industries,
    industriesLoading,
    industriesError,
    templates,
    templatesLoading,
    templatesError,
    selectedIndustry,
    setSelectedIndustry,
    applyPreset,
    isApplying: applyPresetMutation.isPending,
  };
};

