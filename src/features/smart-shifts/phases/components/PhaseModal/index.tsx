'use client';

import React from 'react';
import { X } from 'react-feather';
import { PhaseForm } from '../PhaseForm';
import type { Phase } from '../../types';
import styles from './phase-modal.module.css';

interface PhaseModalProps {
  venueId: string;
  phase?: Phase;
  isOpen: boolean;
  onClose: () => void;
}

export const PhaseModal: React.FC<PhaseModalProps> = ({ venueId, phase, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSuccess = () => {
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{phase ? 'Modifica Fase' : 'Nuova Fase'}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>
        <div className={styles.content}>
          <PhaseForm
            venueId={venueId}
            phase={phase}
            onSuccess={handleSuccess}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

