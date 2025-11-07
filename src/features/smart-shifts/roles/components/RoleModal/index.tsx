'use client';

import React from 'react';
import { X } from 'react-feather';
import { RoleForm } from '../RoleForm';
import type { Role } from '../../types';
import styles from './role-modal.module.css';

interface RoleModalProps {
  role?: Role;
  isOpen: boolean;
  onClose: () => void;
}

export const RoleModal: React.FC<RoleModalProps> = ({ role, isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleSuccess = () => {
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{role ? 'Modifica Ruolo' : 'Nuovo Ruolo'}</h2>
          <button onClick={onClose} className={styles.closeButton}>
            <X size={24} />
          </button>
        </div>
        <div className={styles.content}>
          <RoleForm role={role} onSuccess={handleSuccess} onCancel={onClose} />
        </div>
      </div>
    </div>
  );
};

