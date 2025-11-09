import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { profileApi } from '../../api/profile/profileApi';
import { useNotificationStore } from '@/features/smart-shifts/common/stores/notification';
import type { UpdateProfileData, ChangePasswordData, ChangeEmailData } from '@/types/auth';

export const useProfile = () => {
  return useQuery({
    queryKey: ['user', 'profile'],
    queryFn: () => profileApi.getProfile(),
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  return useMutation({
    mutationFn: (data: UpdateProfileData) => profileApi.updateProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      showNotification({ type: 'success', message: 'Profilo aggiornato con successo' });
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Errore nell\'aggiornamento del profilo';
      showNotification({ type: 'error', message });
    },
  });
};

export const useChangePassword = () => {
  const showNotification = useNotificationStore((state) => state.showNotification);

  return useMutation({
    mutationFn: (data: ChangePasswordData) => profileApi.changePassword(data),
    onSuccess: () => {
      showNotification({ type: 'success', message: 'Password cambiata con successo' });
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Errore nel cambio password';
      showNotification({ type: 'error', message });
    },
  });
};

export const useChangeEmail = () => {
  const queryClient = useQueryClient();
  const showNotification = useNotificationStore((state) => state.showNotification);

  return useMutation({
    mutationFn: (data: ChangeEmailData) => profileApi.changeEmail(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
      showNotification({ type: 'success', message: 'Email aggiornata. Controlla la tua nuova casella di posta per verificare l\'email.' });
    },
    onError: (error: unknown) => {
      const message = (error as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Errore nel cambio email';
      showNotification({ type: 'error', message });
    },
  });
};

