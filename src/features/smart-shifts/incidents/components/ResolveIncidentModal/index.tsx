'use client';

import React, { useState, useEffect } from 'react';
import { Incident } from '../../types';
import { X, AlertCircle } from 'react-feather';
import styles from './resolve-incident-modal.module.css';

interface ResolveIncidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (resolutionNotes: string, actionTaken?: string, resolvedBy?: string) => void;
  incident: Incident | null;
  isLoading?: boolean;
}

export const ResolveIncidentModal: React.FC<ResolveIncidentModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  incident,
  isLoading = false,
}) => {
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [actionTaken, setActionTaken] = useState('');
  const [resolvedBy, setResolvedBy] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setResolutionNotes('');
        setActionTaken('');
        setResolvedBy('');
        setError('');
      }, 0);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!resolutionNotes.trim()) {
      setError('Le note di risoluzione sono obbligatorie');
      return;
    }

    onConfirm(
      resolutionNotes.trim(),
      actionTaken.trim() || undefined,
      resolvedBy.trim() || undefined,
    );
  };

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  if (!isOpen || !incident) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <AlertCircle size={24} />
            <h2 className={styles.title}>Risolvi Incidente</h2>
          </div>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            disabled={isLoading}
            aria-label="Chiudi"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.incidentInfo}>
            <p className={styles.incidentDescription}>{incident.description}</p>
            {incident.staff && (
              <p className={styles.incidentStaff}>Staff: {incident.staff.name}</p>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="resolutionNotes" className={styles.label}>
              Note di Risoluzione <span className={styles.required}>*</span>
            </label>
            <textarea
              id="resolutionNotes"
              value={resolutionNotes}
              onChange={(e) => {
                setResolutionNotes(e.target.value);
                setError('');
              }}
              className={styles.textarea}
              placeholder="Descrivi come è stato risolto l'incidente..."
              rows={4}
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="actionTaken" className={styles.label}>
              Azione Intrapresa
            </label>
            <input
              id="actionTaken"
              type="text"
              value={actionTaken}
              onChange={(e) => setActionTaken(e.target.value)}
              className={styles.input}
              placeholder="Es: Avviso, Sospensione, Formazione..."
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="resolvedBy" className={styles.label}>
              Risolto Da
            </label>
            <input
              id="resolvedBy"
              type="text"
              value={resolvedBy}
              onChange={(e) => setResolvedBy(e.target.value)}
              className={styles.input}
              placeholder="Nome del manager che ha risolto..."
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className={styles.error}>
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Annulla
            </button>
            <button
              type="submit"
              className={styles.confirmButton}
              disabled={isLoading}
            >
              {isLoading ? 'Risoluzione...' : 'Risolvi Incidente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

