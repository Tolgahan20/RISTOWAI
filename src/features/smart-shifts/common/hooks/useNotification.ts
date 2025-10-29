import { useCallback } from 'react';
import { useNotificationStore, NotificationType } from '../stores/notification';

interface NotifyOptions {
  duration?: number;
}

export const useNotification = () => {
  const { showNotification } = useNotificationStore();

  const notify = useCallback(
    (type: NotificationType, message: string, options?: NotifyOptions) => {
      showNotification({
        type,
        message,
        duration: options?.duration,
      });
    },
    [showNotification]
  );

  return {
    success: (message: string, options?: NotifyOptions) =>
      notify('success', message, options),
    error: (message: string, options?: NotifyOptions) =>
      notify('error', message, options),
    info: (message: string, options?: NotifyOptions) =>
      notify('info', message, options),
    warning: (message: string, options?: NotifyOptions) =>
      notify('warning', message, options),
  };
};
