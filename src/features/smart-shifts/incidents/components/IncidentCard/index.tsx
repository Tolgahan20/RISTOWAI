'use client';

import React from 'react';
import { Incident, IncidentStatus } from '../../types';
import {
  getIncidentTypeLabel,
  getIncidentSeverityLabel,
  getIncidentStatusLabel,
  getIncidentSeverityColor,
  getIncidentStatusColor,
} from '../../utils/incidentHelpers';
import { Clock, AlertCircle, CheckCircle, User } from 'react-feather';
import styles from './incident-card.module.css';

interface IncidentCardProps {
  incident: Incident;
  onResolve?: (incident: Incident) => void;
  onClose?: (incident: Incident) => void;
  onEdit?: (incident: Incident) => void;
  onDelete?: (incident: Incident) => void;
  isActionLoading?: boolean;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({
  incident,
  onResolve,
  onClose,
  onEdit,
  onDelete,
  isActionLoading = false,
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const canResolve = incident.status === IncidentStatus.OPEN;
  const canClose = incident.status === IncidentStatus.RESOLVED;
  const canEdit = incident.status !== IncidentStatus.CLOSED;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span
            className={styles.typeBadge}
            style={{ backgroundColor: getIncidentSeverityColor(incident.severity) }}
          >
            {getIncidentTypeLabel(incident.incidentType)}
          </span>
          <span
            className={styles.severityBadge}
            style={{ backgroundColor: getIncidentSeverityColor(incident.severity) }}
          >
            {getIncidentSeverityLabel(incident.severity)}
          </span>
        </div>
        <span
          className={styles.statusBadge}
          style={{ backgroundColor: getIncidentStatusColor(incident.status) }}
        >
          {getIncidentStatusLabel(incident.status)}
        </span>
      </div>

      <div className={styles.content}>
        <p className={styles.description}>{incident.description}</p>

        <div className={styles.details}>
          {incident.staff && (
            <div className={styles.detailRow}>
              <User size={16} />
              <span>{incident.staff.name}</span>
            </div>
          )}

          <div className={styles.detailRow}>
            <Clock size={16} />
            <span>{formatDate(incident.incidentDate.toISOString())}</span>
          </div>

          {incident.shift && (
            <div className={styles.detailRow}>
              <AlertCircle size={16} />
              <span>
                Turno: {new Date(incident.shift.startTime).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })} - {new Date(incident.shift.endTime).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          )}

          {incident.reportedBy && (
            <div className={styles.detailRow}>
              <User size={16} />
              <span className={styles.reportedBy}>Segnalato da: {incident.reportedBy}</span>
            </div>
          )}
        </div>

        {incident.resolutionNotes && (
          <div className={styles.resolutionSection}>
            <CheckCircle size={16} />
            <div>
              <p className={styles.resolutionLabel}>Risoluzione:</p>
              <p className={styles.resolutionNotes}>{incident.resolutionNotes}</p>
              {incident.actionTaken && (
                <p className={styles.actionTaken}>Azione: {incident.actionTaken}</p>
              )}
            </div>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        {canEdit && onEdit && (
          <button
            onClick={() => onEdit(incident)}
            className={styles.editButton}
            disabled={isActionLoading}
          >
            Modifica
          </button>
        )}

        {canResolve && onResolve && (
          <button
            onClick={() => onResolve(incident)}
            className={styles.resolveButton}
            disabled={isActionLoading}
          >
            Risolvi
          </button>
        )}

        {canClose && onClose && (
          <button
            onClick={() => onClose(incident)}
            className={styles.closeButton}
            disabled={isActionLoading}
          >
            Chiudi
          </button>
        )}

        {canEdit && onDelete && (
          <button
            onClick={() => onDelete(incident)}
            className={styles.deleteButton}
            disabled={isActionLoading}
          >
            Elimina
          </button>
        )}
      </div>
    </div>
  );
};

