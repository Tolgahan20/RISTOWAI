'use client';

import React from 'react';
import { Clock, LogIn, LogOut, AlertTriangle, Check } from 'react-feather';
import { useTimeEventsList } from '../../hooks';
import { LoadingState, ErrorState } from '@/components/dashboard/ui';
import { formatTime, formatDate } from '@/features/smart-shifts/common/utils/dateHelpers';
import type { TimeEventKind } from '../../types';
import styles from './time-events-list.module.css';

interface TimeEventsListProps {
  staffId: string;
  venueId: string;
}

export const TimeEventsList: React.FC<TimeEventsListProps> = ({
  staffId,
  venueId,
}) => {
  const {
    events,
    isLoading,
    error,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
  } = useTimeEventsList(staffId, venueId);

  const formatDateTime = (dateString: string) => {
    return `${formatDate(dateString)} ${formatTime(dateString)}`;
  };

  const getEventIcon = (kind: TimeEventKind) => {
    switch (kind) {
      case 'IN':
        return <LogIn className={styles.iconIn} size={16} />;
      case 'OUT':
        return <LogOut className={styles.iconOut} size={16} />;
      case 'PAUSE_IN':
        return <Clock size={16} />;
      case 'PAUSE_OUT':
        return <Clock size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getEventLabel = (kind: TimeEventKind) => {
    switch (kind) {
      case 'IN':
        return 'Entrata';
      case 'OUT':
        return 'Uscita';
      case 'PAUSE_IN':
        return 'Inizio Pausa';
      case 'PAUSE_OUT':
        return 'Fine Pausa';
      default:
        return kind;
    }
  };

  const getSourceBadgeClass = (source: string) => {
    switch (source) {
      case 'WEB':
        return styles.badgeWeb;
      case 'APP':
        return styles.badgeApp;
      case 'MANUAL':
        return styles.badgeManual;
      case 'SYSTEM':
        return styles.badgeSystem;
      default:
        return styles.badgeWeb;
    }
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <LoadingState message="Caricamento eventi..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <ErrorState message="Errore nel caricamento degli eventi" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Cronologia Timbrature</h2>
        <div className={styles.filters}>
          <input
            type="date"
            className={styles.dateInput}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="Data inizio"
          />
          <input
            type="date"
            className={styles.dateInput}
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="Data fine"
          />
        </div>
      </div>

      {!events || events.length === 0 ? (
        <div className={styles.emptyState}>
          <Clock size={32} />
          <p>Nessuna timbratura trovata</p>
        </div>
      ) : (
        <div className={styles.eventsList}>
          {events.map((event) => (
            <div key={event.id} className={styles.eventCard}>
              <div className={styles.eventHeader}>
                <div className={styles.eventType}>
                  {getEventIcon(event.kind)}
                  <div>
                    <div style={{ fontSize: 'var(--font-size-base)', fontWeight: '600', color: 'var(--pure-black)', marginBottom: '4px' }}>
                      {getEventLabel(event.kind)}
                    </div>
                    {event.staffName && (
                      <div style={{ fontSize: 'var(--font-size-sm)', color: '#6B7280', fontWeight: '500' }}>
                        {event.staffName}
                      </div>
                    )}
                  </div>
                </div>
                <span
                  className={`${styles.eventBadge} ${getSourceBadgeClass(event.source)}`}
                >
                  {event.source}
                </span>
              </div>

              <div className={styles.eventTimestamp}>
                <Clock size={14} />
                {formatDateTime(event.timestamp)}
              </div>

              {(event.geolocationLat || event.geolocationLon) && (
                <div className={styles.eventDetails}>
                  {event.geolocationLat && event.geolocationLon && (
                    <div className={styles.eventDetail}>
                      <span className={styles.eventDetailLabel}>Posizione:</span>
                      <span className={styles.eventDetailValue}>
                        {event.geolocationLat.toFixed(4)}, {event.geolocationLon.toFixed(4)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {event.anomalyFlag && (
                <div style={{ marginTop: 'var(--spacing-sm)' }}>
                  {event.managerApproved ? (
                    <span className={styles.approvedBadge}>
                      <Check size={14} />
                      Approvata dal Manager
                    </span>
                  ) : (
                    <span className={styles.anomalyBadge}>
                      <AlertTriangle size={14} />
                      {event.anomalyReason || 'Anomalia'}
                    </span>
                  )}
                </div>
              )}

              {event.notes && (
                <div className={styles.notes}>
                  <strong>Note:</strong> {event.notes}
                </div>
              )}

              {event.managerNotes && (
                <div className={styles.notes}>
                  <strong>Note Manager:</strong> {event.managerNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

