import React from 'react';
import { VenueForm } from '../VenueForm';
import type { Venue } from '../../types';
import styles from './venue-modal.module.css';

interface VenueModalProps {
  isOpen: boolean;
  onClose: () => void;
  venue?: Venue;
}

export const VenueModal: React.FC<VenueModalProps> = ({ isOpen, onClose, venue }) => {
  if (!isOpen) return null;

  const handleSuccess = () => {
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{venue ? 'Modifica Locale' : 'Nuovo Locale'}</h2>
          <button className={styles.closeButton} onClick={onClose} type="button">
            ✕
          </button>
        </div>
        <div className={styles.content}>
          <VenueForm venue={venue} onSuccess={handleSuccess} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
};

