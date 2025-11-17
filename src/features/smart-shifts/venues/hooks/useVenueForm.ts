import { useState, useCallback } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { venuesApi } from '../api';
import { useRestaurantId } from '../../../auth/hooks';
import { useNotificationStore } from '../../common/stores/notification';
import { VENUE_MESSAGES } from '../../common/constants/messages';
import type { CreateVenueRequest, UpdateVenueRequest, Venue, VenueType, OpeningHours, VenueSettings, WhatsAppSettings } from '../types';

interface VenueFormData {
  name: string;
  address: string;
  timezone: string;
  type: VenueType;
  openingHours: OpeningHours;
  settings: VenueSettings;
}

export const useVenueForm = (initialVenue?: Venue) => {
  const restaurantId = useRestaurantId() || '';
  const queryClient = useQueryClient();
  const { showNotification } = useNotificationStore();

  const [formData, setFormData] = useState<VenueFormData>({
    name: initialVenue?.name || '',
    address: initialVenue?.address || '',
    timezone: initialVenue?.timezone || 'Europe/Rome',
    type: initialVenue?.type || ('RESTAURANT' as VenueType),
    openingHours: initialVenue?.openingHours || {},
    settings: initialVenue?.settings || {
      minRestHours: 11,
      maxDailyHours: 12,
      enablePunchClock: true,
      breakDuration: 30,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateVenueRequest) => venuesApi.createVenue(restaurantId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues', restaurantId] });
      showNotification({ message: VENUE_MESSAGES.create.success, type: 'success' });
    },
    onError: () => {
      showNotification({ message: VENUE_MESSAGES.create.error, type: 'error' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ venueId, data }: { venueId: string; data: UpdateVenueRequest }) =>
      venuesApi.updateVenue(restaurantId, venueId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['venues', restaurantId] });
      if (initialVenue) {
        queryClient.invalidateQueries({ queryKey: ['venue', restaurantId, initialVenue.id] });
      }
      showNotification({ message: VENUE_MESSAGES.update.success, type: 'success' });
    },
    onError: () => {
      showNotification({ message: VENUE_MESSAGES.update.error, type: 'error' });
    },
  });

  const updateField = useCallback(<K extends keyof VenueFormData>(field: K, value: VenueFormData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const updateOpeningHours = useCallback((day: string, open: string, close: string) => {
    setFormData((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: { open, close },
      },
    }));
  }, []);

  const removeOpeningHours = useCallback((day: string) => {
    setFormData((prev) => {
      const newOpeningHours = { ...prev.openingHours };
      delete newOpeningHours[day as keyof OpeningHours];
      return {
        ...prev,
        openingHours: newOpeningHours,
      };
    });
  }, []);

  const updateSettings = useCallback(<K extends keyof VenueSettings>(field: K, value: VenueSettings[K]) => {
    setFormData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        [field]: value,
      },
    }));
  }, []);

  const updateWhatsAppSettings = useCallback(<K extends keyof WhatsAppSettings>(field: K, value: WhatsAppSettings[K]) => {
    setFormData((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        whatsapp: {
          ...prev.settings.whatsapp,
          [field]: value,
        } as WhatsAppSettings,
      },
    }));
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!formData.name || !formData.type || !formData.timezone) {
        showNotification({ message: 'Compila tutti i campi obbligatori', type: 'error' });
        return;
      }

      const venueData = {
        name: formData.name,
        address: formData.address || undefined,
        timezone: formData.timezone,
        type: formData.type,
        openingHours: Object.keys(formData.openingHours).length > 0 ? formData.openingHours : undefined,
        settings: formData.settings,
      };

      if (initialVenue) {
        await updateMutation.mutateAsync({ venueId: initialVenue.id, data: venueData });
      } else {
        await createMutation.mutateAsync(venueData);
      }
    },
    [formData, initialVenue, createMutation, updateMutation, showNotification]
  );

  return {
    formData,
    updateField,
    updateOpeningHours,
    removeOpeningHours,
    updateSettings,
    updateWhatsAppSettings,
    handleSubmit,
    isSubmitting: createMutation.isPending || updateMutation.isPending,
    isEditing: !!initialVenue,
  };
};

