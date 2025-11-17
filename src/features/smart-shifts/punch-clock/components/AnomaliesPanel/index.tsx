'use client';

import React from 'react';
import { AlertTriangle, Clock, Check, X } from 'react-feather';
import { useAnomaliesPanel } from '../../hooks';
import { LoadingState, ErrorState } from '@/components/dashboard/ui';
import { formatTime, formatDate } from '@/features/smart-shifts/common/utils/dateHelpers';
import styles from './anomalies-panel.module.css';

interface AnomaliesPanelProps {
  venueId: string;
}

export const AnomaliesPanel: React.FC<AnomaliesPanelProps> = ({ venueId }) => {
  const {
    anomalies,
    isLoading,
    error,
    managerNotes,
    updateNotes,
    resolvingId,
    handleResolve,
  } = useAnomaliesPanel(venueId);

  const formatDateTime = (dateString: string) => {
    return `${formatDate(dateString)} ${formatTime(dateString)}`;
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <LoadingState message="Caricamento anomalie..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <ErrorState message="Errore nel caricamento delle anomalie" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>
          <AlertTriangle size={24} />
          Anomalie da Risolvere
        </h2>
        {anomalies && anomalies.length > 0 && (
          <span className={styles.badge}>{anomalies.length}</span>
        )}
      </div>

      {!anomalies || anomalies.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyStateIcon}>
            <Check size={32} />
          </div>
          <div className={styles.emptyStateTitle}>Nessuna Anomalia</div>
          <p>Tutte le timbrature sono regolari!</p>
        </div>
      ) : (
        <div>
          {anomalies.map((anomaly) => (
            <div key={anomaly.id} className={styles.anomalyCard}>
              <div className={styles.anomalyHeader}>
                <div className={styles.anomalyInfo}>
                  <div className={styles.anomalyStaff}>
                    {anomaly.staffName || `Staff ID: ${anomaly.staffId}`}
                  </div>
                  <div className={styles.anomalyTimestamp}>
                    <Clock size={14} />
                    {formatDateTime(anomaly.timestamp)}
                  </div>
                </div>
                <span
                  className={`${styles.anomalyBadge} ${
                    anomaly.kind === 'IN'
                      ? styles.anomalyBadgeIn
                      : styles.anomalyBadgeOut
                  }`}
                >
                  {anomaly.kind === 'IN' ? 'Entrata' : 'Uscita'}
                </span>
              </div>

              <div className={styles.anomalyReason}>
                <div className={styles.anomalyReasonText}>
                  <strong>Motivo:</strong> {anomaly.anomalyReason}
                </div>
              </div>

              {anomaly.notes && (
                <div className={styles.anomalyNotes}>
                  <strong>Note staff:</strong> {anomaly.notes}
                </div>
              )}

              <div className={styles.resolveSection}>
                <textarea
                  className={styles.resolveInput}
                  placeholder="Inserisci note del manager (obbligatorio)..."
                  value={managerNotes[anomaly.id] || ''}
                  onChange={(e) => updateNotes(anomaly.id, e.target.value)}
                  maxLength={500}
                />

                <div className={styles.resolveActions}>
                  <button
                    className={`${styles.resolveButton} ${styles.approveButton}`}
                    onClick={() => handleResolve(anomaly.id, true)}
                    disabled={
                      resolvingId === anomaly.id ||
                      !managerNotes[anomaly.id]?.trim()
                    }
                  >
                    <Check size={16} />
                    {resolvingId === anomaly.id ? 'Approvando...' : 'Approva'}
                  </button>

                  <button
                    className={`${styles.resolveButton} ${styles.rejectButton}`}
                    onClick={() => handleResolve(anomaly.id, false)}
                    disabled={
                      resolvingId === anomaly.id ||
                      !managerNotes[anomaly.id]?.trim()
                    }
                  >
                    <X size={16} />
                    {resolvingId === anomaly.id ? 'Rifiutando...' : 'Rifiuta'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

