'use client';

import React from 'react';
import { X } from 'react-feather';
import { AbsenceForm } from '../AbsenceForm';
import type { Absence } from '../../types';
import styles from './absence-modal.module.css';

interface AbsenceModalProps {
  venueId: string;
  absence?: Absence;
  staffList: Array<{ id: string; name: string }>;
  isOpen: boolean;
  onClose: () => void;
}

export const AbsenceModal: React.FC<AbsenceModalProps> = ({
  venueId,
  absence,
  staffList,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const handleSuccess = () => {
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {absence ? 'Modifica Assenza' : 'Nuova Assenza'}
          </h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>
        <div className={styles.content}>
          <AbsenceForm
            venueId={venueId}
            absence={absence}
            staffList={staffList}
            onSuccess={handleSuccess}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

