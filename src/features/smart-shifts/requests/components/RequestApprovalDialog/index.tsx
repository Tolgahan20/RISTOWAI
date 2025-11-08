'use client';

import React, { useState, useMemo } from 'react';
import { X, AlertCircle, CheckCircle } from 'react-feather';
import { useEmployeeBalance } from '../../../time-bank/hooks';
import type { Request, VisualizeAs } from '../../types';
import styles from './request-approval-dialog.module.css';

interface RequestApprovalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    reviewerNotes?: string;
    visualizeAs?: VisualizeAs;
    hoursOverride?: number;
  }) => void;
  request: Request | null;
  isLoading?: boolean;
}

export const RequestApprovalDialog: React.FC<RequestApprovalDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  request,
  isLoading = false,
}) => {
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [visualizeAs, setVisualizeAs] = useState<VisualizeAs | ''>('');
  const [hoursOverride, setHoursOverride] = useState<string>('');
  const [showHoursOverride, setShowHoursOverride] = useState(false);

  // Compute the year for balance lookup
  const balanceYear = useMemo(() => {
    if (!request?.startDate) return new Date().getFullYear();
    return new Date(request.startDate).getFullYear();
  }, [request]);

  // Fetch balance if TIME_OFF and visualizeAs is selected
  const { data: balance, isLoading: balanceLoading } = useEmployeeBalance(
    request?.staffId || '',
    balanceYear,
  );

  // Reset form
  const resetForm = () => {
    setReviewerNotes('');
    setVisualizeAs('');
    setHoursOverride('');
    setShowHoursOverride(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen || !request) return null;

  // Calculate hours based on request duration
  const calculateDefaultHours = () => {
    const start = new Date(request.startDate);
    const end = new Date(request.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays * 8; // 8 hours per day
  };

  const defaultHours = calculateDefaultHours();
  const requestedHours = hoursOverride ? parseFloat(hoursOverride) : defaultHours;

  // Calculate impact on balance
  const getBalanceImpact = () => {
    if (!balance || visualizeAs === '' || visualizeAs === 'NONE') return null;

    if (visualizeAs === 'VACATION') {
      const newBalance = balance.vacationBalanceH - requestedHours;
      const isNegative = newBalance < 0;
      return {
        current: balance.vacationBalanceH,
        after: newBalance,
        isNegative,
        label: 'Ferie',
      };
    }

    if (visualizeAs === 'ROL') {
      const newBalance = balance.rolBalanceH - requestedHours;
      const isNegative = newBalance < 0;
      return {
        current: balance.rolBalanceH,
        after: newBalance,
        isNegative,
        label: 'ROL',
      };
    }

    return null;
  };

  const balanceImpact = getBalanceImpact();

  const handleConfirm = () => {
    const data: {
      reviewerNotes?: string;
      visualizeAs?: VisualizeAs;
      hoursOverride?: number;
    } = {};

    if (reviewerNotes) data.reviewerNotes = reviewerNotes;
    if (visualizeAs !== '') data.visualizeAs = visualizeAs as VisualizeAs;
    if (hoursOverride) data.hoursOverride = parseFloat(hoursOverride);

    onConfirm(data);
  };

  const isTimeOff = request.type === 'TIME_OFF';

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Approva Richiesta</h2>
          <button
            type="button"
            onClick={handleClose}
            className={styles.closeButton}
            aria-label="Chiudi"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {/* Request Summary */}
          <div className={styles.summary}>
            <p className={styles.summaryText}>
              <strong>{request.staffName}</strong> ha richiesto{' '}
              <strong>{request.durationDays} giorno/i</strong> di assenza dal{' '}
              <strong>{new Date(request.startDate).toLocaleDateString('it-IT')}</strong> al{' '}
              <strong>{new Date(request.endDate).toLocaleDateString('it-IT')}</strong>
            </p>
            {request.reason && (
              <p className={styles.reason}>
                <em>Motivo: {request.reason}</em>
              </p>
            )}
          </div>

          {/* Time Bank Integration (only for TIME_OFF) */}
          {isTimeOff && (
            <div className={styles.timeBank}>
              <h3 className={styles.sectionTitle}>Gestione Banca Ore</h3>

              <div className={styles.field}>
                <label className={styles.label}>
                  Conteggia come: <span className={styles.optional}>(opzionale)</span>
                </label>
                <select
                  className={styles.select}
                  value={visualizeAs}
                  onChange={(e) => setVisualizeAs(e.target.value as VisualizeAs | '')}
                >
                  <option value="">Nessun conteggio</option>
                  <option value="VACATION">Ferie</option>
                  <option value="ROL">ROL / Permessi</option>
                  <option value="NONE">Altro (non conteggiato)</option>
                </select>
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  Ore previste: <strong>{defaultHours}h</strong>
                  {!showHoursOverride && (
                    <button
                      type="button"
                      className={styles.overrideButton}
                      onClick={() => setShowHoursOverride(true)}
                    >
                      Modifica
                    </button>
                  )}
                </label>
                {showHoursOverride && (
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    className={styles.input}
                    value={hoursOverride}
                    onChange={(e) => setHoursOverride(e.target.value)}
                    placeholder={`Default: ${defaultHours}h`}
                  />
                )}
              </div>

              {/* Balance Impact */}
              {balanceLoading && <p className={styles.loading}>Caricamento saldo...</p>}
              {balance && balanceImpact && (
                <div
                  className={`${styles.balanceImpact} ${balanceImpact.isNegative ? styles.warning : styles.success}`}
                >
                  {balanceImpact.isNegative ? (
                    <AlertCircle size={20} className={styles.icon} />
                  ) : (
                    <CheckCircle size={20} className={styles.icon} />
                  )}
                  <div className={styles.balanceDetails}>
                    <p className={styles.balanceLabel}>Impatto su {balanceImpact.label}:</p>
                    <p className={styles.balanceValues}>
                      {balanceImpact.current.toFixed(1)}h → <strong>{balanceImpact.after.toFixed(1)}h</strong>
                    </p>
                    {balanceImpact.isNegative && (
                      <p className={styles.warningText}>
                        ⚠️ Saldo negativo previsto. Valutare con attenzione.
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Reviewer Notes */}
          <div className={styles.field}>
            <label className={styles.label}>
              Note del manager <span className={styles.optional}>(opzionale)</span>
            </label>
            <textarea
              className={styles.textarea}
              value={reviewerNotes}
              onChange={(e) => setReviewerNotes(e.target.value)}
              placeholder="Aggiungi note o commenti sull'approvazione..."
              rows={3}
            />
          </div>
        </div>

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
            type="button"
            onClick={handleConfirm}
            className={styles.confirmButton}
            disabled={isLoading}
          >
            {isLoading ? 'Approvazione...' : 'Approva'}
          </button>
        </div>
      </div>
    </div>
  );
};

