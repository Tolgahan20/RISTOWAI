'use client';

import React from 'react';
import { Clock, CheckCircle, DollarSign, Archive } from 'react-feather';
import type { ExtraHoursItem } from '../../types';
import { ExtraHoursDisposition } from '../../types';
import { useExtraHoursSection } from '../../hooks/useExtraHoursSection';
import styles from './extra-hours-section.module.css';

interface ExtraHoursSectionProps {
  extraHours: ExtraHoursItem[];
  onApprove: (staffId: string, weekStartDate: string, extraHours: number, disposition: ExtraHoursDisposition, notes?: string) => void;
  isApproving?: boolean;
}

export const ExtraHoursSection: React.FC<ExtraHoursSectionProps> = ({
  extraHours,
  onApprove,
  isApproving = false,
}) => {
  const {
    expandedId,
    disposition,
    notes,
    setDisposition,
    setNotes,
    handleApprove,
    toggleExpand,
  } = useExtraHoursSection(onApprove);

  const pendingExtraHours = extraHours.filter((e) => !e.isApproved);
  const approvedExtraHours = extraHours.filter((e) => e.isApproved);

  if (extraHours.length === 0) {
    return (
      <div className={styles.emptyState}>
        <CheckCircle size={48} color="#10b981" />
        <p className={styles.emptyTitle}>Nessuna Ora Extra</p>
        <p className={styles.emptyDescription}>
          Non ci sono ore extra da approvare per questa settimana.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Clock size={20} />
          Ore Extra ({pendingExtraHours.length} da approvare)
        </h3>
      </div>

      <div className={styles.list}>
        {pendingExtraHours.map((item) => (
          <div
            key={item.staffId}
            className={`${styles.extraHoursCard} ${expandedId === item.staffId ? styles.expanded : ''}`}
          >
            <div
              className={styles.cardHeader}
              onClick={() => toggleExpand(item.staffId)}
            >
              <div className={styles.staffInfo}>
                <p className={styles.staffName}>{item.staffName}</p>
                <p className={styles.hoursDetail}>
                  Pianificate: {item.plannedHours.toFixed(1)}h · Effettive: {item.actualHours.toFixed(1)}h
                </p>
              </div>
              <div className={styles.extraHoursBadge}>
                +{item.extraHours.toFixed(1)}h
              </div>
            </div>

            {expandedId === item.staffId && (
              <div className={styles.approvalForm}>
                <div className={styles.formField}>
                  <label className={styles.label}>Come gestire le ore extra?</label>
                  <div className={styles.dispositionOptions}>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        value={ExtraHoursDisposition.PAID}
                        checked={disposition === ExtraHoursDisposition.PAID}
                        onChange={(e) => setDisposition(e.target.value as ExtraHoursDisposition)}
                      />
                      <DollarSign size={16} />
                      <span>Pagate</span>
                    </label>
                    <label className={styles.radioLabel}>
                      <input
                        type="radio"
                        value={ExtraHoursDisposition.BANKED}
                        checked={disposition === ExtraHoursDisposition.BANKED}
                        onChange={(e) => setDisposition(e.target.value as ExtraHoursDisposition)}
                      />
                      <Archive size={16} />
                      <span>Banca Ore</span>
                    </label>
                  </div>
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Note (opzionale)</label>
                  <textarea
                    className={styles.textarea}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Aggiungi note sull'approvazione..."
                    rows={2}
                  />
                </div>

                <div className={styles.formActions}>
                  <button
                    onClick={() => toggleExpand(item.staffId)}
                    className={styles.cancelButton}
                    disabled={isApproving}
                  >
                    Annulla
                  </button>
                  <button
                    onClick={() => handleApprove(item)}
                    className={styles.approveButton}
                    disabled={isApproving}
                  >
                    {isApproving ? 'Approvazione...' : 'Approva'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {approvedExtraHours.length > 0 && (
          <>
            <div className={styles.separator}>
              <span>Ore Extra Approvate</span>
            </div>
            {approvedExtraHours.map((item) => (
              <div key={item.staffId} className={`${styles.extraHoursCard} ${styles.approved}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.staffInfo}>
                    <p className={styles.staffName}>{item.staffName}</p>
                    <p className={styles.hoursDetail}>
                      +{item.extraHours.toFixed(1)}h ·{' '}
                      {item.disposition === ExtraHoursDisposition.PAID ? 'Pagate' : 'Banca Ore'}
                    </p>
                  </div>
                  <CheckCircle size={20} color="#10b981" />
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

