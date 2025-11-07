'use client';

import React from 'react';
import { LogIn, LogOut, AlertTriangle } from 'react-feather';
import { usePunchClockWidget } from '../../hooks';
import { LoadingState, ErrorState } from '@/components/dashboard/ui';
import { formatTime, formatDate } from '@/features/smart-shifts/common/utils/dateHelpers';
import styles from './punch-clock-widget.module.css';

interface PunchClockWidgetProps {
  staffId: string;
  venueId: string;
  shiftId?: string;
}

export const PunchClockWidget: React.FC<PunchClockWidgetProps> = ({
  staffId,
  venueId,
  shiftId,
}) => {
  const {
    currentTime,
    notes,
    setNotes,
    status,
    isLoading,
    error,
    handleClockIn,
    handleClockOut,
    clockIn,
    clockOut,
  } = usePunchClockWidget(staffId, venueId, shiftId);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <LoadingState message="Caricamento..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <ErrorState message="Errore nel caricamento dello stato" />
      </div>
    );
  }

  const formatCurrentTime = (date: Date) => {
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatDateTime = (dateString: string) => {
    return `${formatDate(dateString)} ${formatTime(dateString)}`;
  };

  return (
    <div className={styles.container}>
      {/* Status Indicator */}
      <div className={styles.status}>
        <div
          className={`${styles.statusIcon} ${
            status?.isClockedIn ? styles.statusIconIn : styles.statusIconOut
          }`}
        >
          {status?.isClockedIn ? '✓' : '○'}
        </div>
        <div className={styles.statusTitle}>
          {status?.isClockedIn ? 'Timbrato In' : 'Non Timbrato'}
        </div>
        {status?.lastEvent && (
          <div className={styles.statusTime}>
            {formatDateTime(status.lastEvent.timestamp)}
          </div>
        )}
      </div>

      {/* Current Time */}
      <div className={styles.currentTime}>{formatCurrentTime(currentTime)}</div>

      {/* Notes Input */}
      <textarea
        className={styles.notesInput}
        placeholder="Note opzionali..."
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        maxLength={500}
      />

      {/* Action Buttons */}
      <div className={styles.actions}>
        <button
          className={`${styles.actionButton} ${styles.clockInButton}`}
          onClick={handleClockIn}
          disabled={status?.isClockedIn || clockIn.isPending}
        >
          <LogIn size={20} />
          {clockIn.isPending ? 'Timbrando...' : 'Timbra Entrata'}
        </button>

        <button
          className={`${styles.actionButton} ${styles.clockOutButton}`}
          onClick={handleClockOut}
          disabled={!status?.isClockedIn || clockOut.isPending}
        >
          <LogOut size={20} />
          {clockOut.isPending ? 'Timbrando...' : 'Timbra Uscita'}
        </button>
      </div>

      {/* Anomaly Warning */}
      {status?.lastEvent?.anomalyFlag && !status.lastEvent.managerApproved && (
        <div className={styles.anomaly}>
          <div className={styles.anomalyTitle}>
            <AlertTriangle size={16} />
            Anomalia Rilevata
          </div>
          <div className={styles.anomalyReason}>
            {status.lastEvent.anomalyReason}
          </div>
        </div>
      )}

      {/* Last Event Info */}
      {status?.lastEvent && (
        <div className={styles.lastEvent}>
          <strong>Ultimo evento:</strong>{' '}
          {status.lastEvent.kind === 'IN' ? 'Entrata' : 'Uscita'} alle{' '}
          {formatDateTime(status.lastEvent.timestamp)}
        </div>
      )}
    </div>
  );
};

