'use client';

import React from 'react';
import { X } from 'react-feather';
import { RequestForm } from '../RequestForm';
import type { Request } from '../../types';
import styles from './request-modal.module.css';

interface RequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  venueId: string;
  request?: Request;
  staffList: Array<{ id: string; name: string }>;
}

export const RequestModal: React.FC<RequestModalProps> = ({
  isOpen,
  onClose,
  venueId,
  request,
  staffList,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {request ? 'Modifica Richiesta' : 'Nuova Richiesta'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Chiudi"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          <RequestForm
            venueId={venueId}
            request={request}
            staffList={staffList}
            onSuccess={onClose}
            onCancel={onClose}
          />
        </div>
      </div>
    </div>
  );
};

