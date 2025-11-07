'use client';

import React, { useState } from 'react';
import { Calendar, Clock, FileText, User, AlertTriangle } from 'react-feather';
import type { ShiftSnapshot } from '../../types';
import { SnapshotStatus } from '../../types';
import styles from './snapshot-detail.module.css';

interface SnapshotDetailProps {
  snapshot: ShiftSnapshot;
  history: ShiftSnapshot[];
}

export const SnapshotDetail: React.FC<SnapshotDetailProps> = ({ snapshot, history }) => {
  const [activeTab, setActiveTab] = useState<'shifts' | 'history'>('shifts');

  const getStatusBadge = (status: SnapshotStatus) => {
    const badges = {
      [SnapshotStatus.DRAFT]: { label: 'Bozza', className: styles.badgeDraft },
      [SnapshotStatus.PUBLISHED]: { label: 'Pubblicato', className: styles.badgePublished },
      [SnapshotStatus.LOCKED]: { label: 'Bloccato', className: styles.badgeLocked },
      [SnapshotStatus.ARCHIVED]: { label: 'Archiviato', className: styles.badgeArchived },
    };
    const badge = badges[status];
    return <span className={`${styles.badge} ${badge.className}`}>{badge.label}</span>;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    return date.toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const groupShiftsByDate = () => {
    const grouped: { [key: string]: typeof snapshot.shiftsJson } = {};
    snapshot.shiftsJson.forEach((shift) => {
      const date = new Date(shift.startTime).toLocaleDateString('it-IT');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(shift);
    });
    return grouped;
  };

  const groupedShifts = groupShiftsByDate();

  return (
    <div className={styles.container}>
      {/* Summary Card */}
      <div className={styles.summaryCard}>
        <div className={styles.summaryHeader}>
          <div className={styles.summaryTitle}>
            <Calendar size={20} />
            <span>Snapshot v{snapshot.version}</span>
          </div>
          {getStatusBadge(snapshot.status)}
        </div>

        <div className={styles.summaryGrid}>
          <div className={styles.summaryItem}>
            <Clock size={16} />
            <div>
              <div className={styles.summaryLabel}>Periodo</div>
              <div className={styles.summaryValue}>
                {new Date(snapshot.startDate).toLocaleDateString('it-IT')} -{' '}
                {new Date(snapshot.endDate).toLocaleDateString('it-IT')}
              </div>
            </div>
          </div>

          <div className={styles.summaryItem}>
            <FileText size={16} />
            <div>
              <div className={styles.summaryLabel}>Turni Totali</div>
              <div className={styles.summaryValue}>{snapshot.totalShifts}</div>
            </div>
          </div>

          <div className={styles.summaryItem}>
            <Clock size={16} />
            <div>
              <div className={styles.summaryLabel}>Ore Totali</div>
              <div className={styles.summaryValue}>{snapshot.totalHours.toFixed(1)}h</div>
            </div>
          </div>

          <div className={styles.summaryItem}>
            <User size={16} />
            <div>
              <div className={styles.summaryLabel}>Creato</div>
              <div className={styles.summaryValue}>{formatDateTime(snapshot.createdAt)}</div>
            </div>
          </div>

          {snapshot.publishedAt && (
            <div className={styles.summaryItem}>
              <AlertTriangle size={16} />
              <div>
                <div className={styles.summaryLabel}>Pubblicato</div>
                <div className={styles.summaryValue}>{formatDateTime(snapshot.publishedAt)}</div>
              </div>
            </div>
          )}
        </div>

        {snapshot.notes && (
          <div className={styles.notes}>
            <FileText size={14} />
            <span>{snapshot.notes}</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'shifts' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('shifts')}
        >
          Turni ({snapshot.totalShifts})
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'history' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <User size={14} />
          Cronologia ({history.length})
        </button>
      </div>

      {/* Content */}
      {activeTab === 'shifts' ? (
        <div className={styles.shiftsContainer}>
          {Object.entries(groupedShifts).map(([date, shifts]) => (
            <div key={date} className={styles.dayGroup}>
              <div className={styles.dayHeader}>
                <Calendar size={16} />
                <span>{date}</span>
                <span className={styles.dayCount}>({shifts.length} turni)</span>
              </div>

              <div className={styles.shiftsList}>
                {shifts.map((shift) => (
                  <div key={shift.id} className={styles.shiftCard}>
                    <div className={styles.shiftTime}>
                      <Clock size={14} />
                      <span>
                        {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                      </span>
                    </div>

                    <div className={styles.shiftStaff}>
                      <User size={14} />
                      <span>{shift.staffName}</span>
                    </div>

                    <div className={styles.shiftRole}>{shift.role}</div>

                    {shift.phaseName && (
                      <div className={styles.shiftPhase}>{shift.phaseName}</div>
                    )}

                    {shift.notes && (
                      <div className={styles.shiftNotes}>
                        <FileText size={12} />
                        <span>{shift.notes}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.historyContainer}>
          {history.length === 0 ? (
            <div className={styles.emptyHistory}>
              <User size={32} />
              <p>Nessuna versione precedente</p>
            </div>
          ) : (
            history.map((version) => (
              <div key={version.id} className={styles.historyCard}>
                <div className={styles.historyVersion}>v{version.version}</div>
                <div className={styles.historyInfo}>
                  <div className={styles.historyTitle}>
                    {new Date(version.snapshotDate).toLocaleDateString('it-IT')}
                  </div>
                  <div className={styles.historyMeta}>
                    {version.totalShifts} turni • {version.totalHours.toFixed(1)}h •{' '}
                    {formatDateTime(version.createdAt)}
                  </div>
                  {version.notes && <div className={styles.historyNotes}>{version.notes}</div>}
                </div>
                {getStatusBadge(version.status)}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

