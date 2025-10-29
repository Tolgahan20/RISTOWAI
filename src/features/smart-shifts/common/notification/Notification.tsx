import React from 'react';
import { useNotificationStore } from '../stores/notification';
import styles from './notification.module.css';

export const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotificationStore();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className={styles.notificationContainer}>
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`${styles.notification} ${styles[notification.type]}`}
          role="alert"
        >
          <div className={styles.message}>{notification.message}</div>
          <button
            className={styles.closeButton}
            onClick={() => removeNotification(notification.id)}
            aria-label="Close notification"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 4L4 12M4 4L12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};
