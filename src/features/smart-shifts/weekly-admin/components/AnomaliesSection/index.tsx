'use client';

import React from 'react';
import { AlertCircle, CheckCircle } from 'react-feather';
import type { AnomalyItem } from '../../types';
import { getAnomalyTypeLabel, getAnomalySeverityColor } from '../../utils/weekHelpers';
import { useAnomaliesSection } from '../../hooks/useAnomaliesSection';
import styles from './anomalies-section.module.css';

interface AnomaliesSectionProps {
  anomalies: AnomalyItem[];
  onResolve: (timeEventId: string, notes: string, approvedHours?: number) => void;
  isResolving?: boolean;
}

export const AnomaliesSection: React.FC<AnomaliesSectionProps> = ({
  anomalies,
  onResolve,
  isResolving = false,
}) => {
  const {
    expandedId,
    resolutionNotes,
    approvedHours,
    setResolutionNotes,
    setApprovedHours,
    handleResolve,
    toggleExpand,
  } = useAnomaliesSection(onResolve);

  const unresolvedAnomalies = anomalies.filter((a) => !a.isResolved);
  const resolvedAnomalies = anomalies.filter((a) => a.isResolved);

  if (anomalies.length === 0) {
    return (
      <div className={styles.emptyState}>
        <CheckCircle size={48} color="#10b981" />
        <p className={styles.emptyTitle}>Nessuna Anomalia</p>
        <p className={styles.emptyDescription}>
          Ottimo lavoro! Non ci sono anomalie da risolvere per questa settimana.
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <AlertCircle size={20} />
          Anomalie ({unresolvedAnomalies.length} da risolvere)
        </h3>
      </div>

      <div className={styles.list}>
        {unresolvedAnomalies.map((anomaly) => (
          <div
            key={anomaly.id}
            className={`${styles.anomalyCard} ${expandedId === anomaly.id ? styles.expanded : ''}`}
          >
            <div
              className={styles.anomalyHeader}
              onClick={() => toggleExpand(anomaly.id)}
            >
              <div className={styles.anomalyInfo}>
                <div
                  className={styles.severityDot}
                  style={{ backgroundColor: getAnomalySeverityColor(anomaly.severity) }}
                />
                <div className={styles.anomalyDetails}>
                  <p className={styles.staffName}>{anomaly.staffName}</p>
                  <p className={styles.anomalyMeta}>
                    {getAnomalyTypeLabel(anomaly.anomalyType)} ·{' '}
                    {new Date(anomaly.date).toLocaleDateString('it-IT')}
                  </p>
                </div>
              </div>
              <div className={styles.anomalyDescription}>
                {anomaly.description}
              </div>
            </div>

            {expandedId === anomaly.id && (
              <div className={styles.resolutionForm}>
                <div className={styles.formField}>
                  <label className={styles.label}>Note di Risoluzione</label>
                  <textarea
                    className={styles.textarea}
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Inserisci note sulla risoluzione..."
                    rows={3}
                  />
                </div>

                <div className={styles.formField}>
                  <label className={styles.label}>Ore Approvate (opzionale)</label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    className={styles.input}
                    value={approvedHours}
                    onChange={(e) => setApprovedHours(e.target.value)}
                    placeholder="es. 8.5"
                  />
                </div>

                <div className={styles.formActions}>
                  <button
                    onClick={() => toggleExpand(anomaly.id)}
                    className={styles.cancelButton}
                    disabled={isResolving}
                  >
                    Annulla
                  </button>
                  <button
                    onClick={() => handleResolve(anomaly.timeEventId)}
                    className={styles.resolveButton}
                    disabled={!resolutionNotes.trim() || isResolving}
                  >
                    {isResolving ? 'Risoluzione...' : 'Risolvi Anomalia'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {resolvedAnomalies.length > 0 && (
          <>
            <div className={styles.separator}>
              <span>Anomalie Risolte</span>
            </div>
            {resolvedAnomalies.map((anomaly) => (
              <div key={anomaly.id} className={`${styles.anomalyCard} ${styles.resolved}`}>
                <div className={styles.anomalyHeader}>
                  <div className={styles.anomalyInfo}>
                    <CheckCircle size={16} color="#10b981" />
                    <div className={styles.anomalyDetails}>
                      <p className={styles.staffName}>{anomaly.staffName}</p>
                      <p className={styles.anomalyMeta}>
                        {getAnomalyTypeLabel(anomaly.anomalyType)} ·{' '}
                        {new Date(anomaly.date).toLocaleDateString('it-IT')}
                      </p>
                    </div>
                  </div>
                  {anomaly.resolutionNotes && (
                    <p className={styles.resolutionNote}>{anomaly.resolutionNotes}</p>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

