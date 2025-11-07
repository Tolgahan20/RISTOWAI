import React from 'react';
import { StaffForm } from '../StaffForm';
import type { Staff } from '../../types';
import styles from './staff-modal.module.css';

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  staff?: Staff;
  venueId: string;
}

export const StaffModal: React.FC<StaffModalProps> = ({ isOpen, onClose, staff, venueId }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>{staff ? 'Modifica Dipendente' : 'Nuovo Dipendente'}</h2>
          <button className={styles.closeButton} onClick={onClose} type="button">
            ✕
          </button>
        </div>
        <div className={styles.content}>
          <StaffForm venueId={venueId} staff={staff} onSuccess={onClose} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
};

