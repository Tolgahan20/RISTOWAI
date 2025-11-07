'use client';

import React, { useState, useEffect } from 'react';
import { X, AlertTriangle, TrendingUp } from 'react-feather';
import { useBalanceWarning } from '../../hooks/useTimeBank';
import { Button } from '@/components/dashboard/ui/Button';
import { Select } from '@/components/dashboard/ui/Select';
import { Input } from '@/components/dashboard/ui/Input';
import type { Absence } from '@/features/smart-shifts/absences/types';
import styles from './approval-dialog.module.css';

interface ApprovalDialogProps {
  absence: Absence;
  isOpen: boolean;
  onApprove: (visualizeAs: 'VACATION' | 'ROL' | 'NONE', hoursOverride?: number, notes?: string) => Promise<void>;
  onClose: () => void;
}

export const ApprovalDialog: React.FC<ApprovalDialogProps> = ({
  absence,
  isOpen,
  onApprove,
  onClose,
}) => {
  const [visualizeAs, setVisualizeAs] = useState<'VACATION' | 'ROL' | 'NONE'>('NONE');
  const [hoursOverride, setHoursOverride] = useState<string>('');
  const [managerNotes, setManagerNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate hours from days if not overridden
  const durationDays = absence.durationDays || 1;
  const hoursPerDay = 6; // Default, should come from policy
  const calculatedHours = durationDays * hoursPerDay;
  const requestedHours = hoursOverride ? parseFloat(hoursOverride) : calculatedHours;

  // Fetch balance warning
  const { data: warning, isLoading: isLoadingWarning } = useBalanceWarning(
    absence.staffId,
    visualizeAs,
    requestedHours,
    absence.startDate,
    visualizeAs !== 'NONE',
  );

  useEffect(() => {
    if (!isOpen) {
      // Reset form when modal closes
      setVisualizeAs('NONE');
      setHoursOverride('');
      setManagerNotes('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const hours = hoursOverride ? parseFloat(hoursOverride) : undefined;
      await onApprove(visualizeAs, hours, managerNotes || undefined);
      onClose();
    } catch (error) {
      console.error('Failed to approve absence:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Approva Assenza</h2>
          <button onClick={onClose} className={styles.closeButton} type="button">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.content}>
          {/* Absence Summary */}
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Dipendente:</span>
              <span className={styles.summaryValue}>{absence.staffId}</span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Periodo:</span>
              <span className={styles.summaryValue}>
                {new Date(absence.startDate).toLocaleDateString('it-IT')} -{' '}
                {new Date(absence.endDate).toLocaleDateString('it-IT')}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Durata:</span>
              <span className={styles.summaryValue}>
                {durationDays} {durationDays === 1 ? 'giorno' : 'giorni'}
              </span>
            </div>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Motivo:</span>
              <span className={styles.summaryValue}>{absence.reason}</span>
            </div>
          </div>

          {/* Time Bank Section */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>
              Banca Ore (solo visivo)
            </h3>
            <p className={styles.sectionDescription}>
              Categorizza questa assenza per il tracking visivo delle ore. Nessun effetto legale o contabile.
            </p>

            <div className={styles.field}>
              <label className={styles.label}>Categorizza come:</label>
              <Select
                value={visualizeAs}
                onChange={(e) => setVisualizeAs(e.target.value as 'VACATION' | 'ROL' | 'NONE')}
              >
                <option value="NONE">Altro (nessun tracking)</option>
                <option value="VACATION">Ferie (visual)</option>
                <option value="ROL">ROL (visual)</option>
              </Select>
            </div>

            {visualizeAs !== 'NONE' && (
              <>
                <div className={styles.field}>
                  <label className={styles.label}>
                    Ore (opzionale, default: {calculatedHours.toFixed(1)} h)
                  </label>
                  <Input
                    type="number"
                    step="0.5"
                    min="0"
                    value={hoursOverride}
                    onChange={(e) => setHoursOverride(e.target.value)}
                    placeholder={`Default: ${calculatedHours.toFixed(1)} ore`}
                  />
                  <span className={styles.fieldHint}>
                    Calcolato automaticamente: {durationDays} giorni × {hoursPerDay} ore/giorno
                  </span>
                </div>

                {/* Balance Warning */}
                {isLoadingWarning && (
                  <div className={styles.infoBox}>
                    <TrendingUp size={16} />
                    <p>Caricamento saldo...</p>
                  </div>
                )}

                {warning && !isLoadingWarning && (
                  <div className={styles.balanceInfo}>
                    <div className={styles.balanceRow}>
                      <span>Saldo attuale:</span>
                      <span className={styles.balanceValue}>
                        {warning.currentBalance.toFixed(1)} h
                      </span>
                    </div>
                    <div className={styles.balanceRow}>
                      <span>Ore richieste:</span>
                      <span className={styles.balanceValue}>
                        {warning.requestedHours.toFixed(1)} h
                      </span>
                    </div>
                    <div className={styles.balanceRow}>
                      <span>Proiezione fine anno:</span>
                      <span className={warning.hasWarning ? styles.balanceWarning : styles.balanceValue}>
                        {warning.projectedYearEndBalance.toFixed(1)} h
                      </span>
                    </div>

                    {warning.hasWarning && warning.message && (
                      <div className={styles.warningBox}>
                        <AlertTriangle size={16} />
                        <p>{warning.message}</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Manager Notes */}
          <div className={styles.field}>
            <label className={styles.label}>Note manager (opzionale):</label>
            <textarea
              className={styles.textarea}
              value={managerNotes}
              onChange={(e) => setManagerNotes(e.target.value)}
              placeholder="Aggiungi eventuali note..."
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className={styles.actions}>
            <Button
              type="button"
              variant="secondary"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Annulla
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Approvazione...' : 'Approva Assenza'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

