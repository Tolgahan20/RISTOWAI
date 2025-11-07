'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'react-feather';
import { Button } from '../Button';
import styles from './confirm-modal.module.css';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Conferma',
  cancelText = 'Annulla',
  variant = 'danger',
  isLoading = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const IconComponent = variant === 'danger' ? AlertCircle : variant === 'warning' ? AlertTriangle : Info;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.modal}>
        <div className={`${styles.header} ${styles[variant]}`}>
          <div className={styles.iconWrapper}>
            <IconComponent size={24} />
          </div>
          <h3 className={styles.title}>{title}</h3>
        </div>
        
        <div className={styles.content}>
          <p className={styles.message}>{message}</p>
        </div>

        <div className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className={styles.cancelButton}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant="primary"
            onClick={handleConfirm}
            disabled={isLoading}
            className={`${styles.confirmButton} ${styles[`${variant}Button`]}`}
          >
            {isLoading ? 'Attendere...' : confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}

