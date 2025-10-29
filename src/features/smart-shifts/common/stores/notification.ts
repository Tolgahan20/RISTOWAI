import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  duration?: number;
}

interface NotificationState {
  notifications: Notification[];
}

interface NotificationActions {
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

type NotificationStore = NotificationState & NotificationActions;

type State = NotificationState;

export const useNotificationStore = create<NotificationStore>()(
  devtools(
    (set) => ({
      notifications: [],
      showNotification: (notification) => {
        const id = Math.random().toString(36).substring(7);
        set(
          (state: State) => ({
            ...state,
            notifications: [
              ...state.notifications,
              {
                ...notification,
                id,
              },
            ],
          }),
          false,
          'notifications/show'
        );

        // Auto remove notification after duration
        if (notification.duration !== 0) {
          setTimeout(() => {
            set(
              (state: State) => ({
                ...state,
                notifications: state.notifications.filter((n) => n.id !== id),
              }),
              false,
              'notifications/autoRemove'
            );
          }, notification.duration || 5000); // Default 5 seconds
        }
      },
      removeNotification: (id) =>
        set(
          (state: State) => ({
            ...state,
            notifications: state.notifications.filter((n) => n.id !== id),
          }),
          false,
          'notifications/remove'
        ),
      clearNotifications: () => 
        set(
          (state: State) => ({
            ...state,
            notifications: [],
          }),
          false,
          'notifications/clear'
        ),
    }),
    { name: 'notification-store' }
  )
);