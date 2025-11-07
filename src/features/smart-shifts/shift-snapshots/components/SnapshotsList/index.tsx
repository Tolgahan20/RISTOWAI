'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, Clock } from 'react-feather';
import { useSnapshotsList } from '../../hooks';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/ui';
import { Pagination } from '@/components/dashboard/ui/Pagination';
import { Select } from '@/components/dashboard/ui/Select';   
import { SnapshotStatus } from '../../types';
import styles from './snapshots-list.module.css';
import { Route } from 'next';

interface SnapshotsListProps {
  venueId: string;
}

export const SnapshotsList: React.FC<SnapshotsListProps> = ({ venueId }) => {
  const {
    snapshots,
    total,
    page,
    totalPages,
    limit,
    isLoading,
    error,
    filterStatus,
    filterStartDateFrom,
    filterStartDateTo,
    setPage,
    setLimit,
    setFilterStatus,
    setFilterStartDateFrom,
    setFilterStartDateTo,
    clearFilters,
  } = useSnapshotsList(venueId);

  const getStatusBadge = (status: SnapshotStatus) => {
    const badges = {
      [SnapshotStatus.DRAFT]: { label: 'Bozza', className: styles.badgeDraft },
      [SnapshotStatus.PUBLISHED]: { label: 'Pubblicato', className: styles.badgePublished },
      [SnapshotStatus.LOCKED]: { label: 'Bloccato', className: styles.badgeLocked },
      [SnapshotStatus.ARCHIVED]: { label: 'Archiviato', className: styles.badgeArchived },
    };
    const badge = badges[status];
    return (
      <span className={`${styles.badge} ${badge.className}`}>
        {badge.label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT');
  };

  if (isLoading) return <LoadingState />;
  if (error) return <ErrorState message="Errore nel caricamento degli snapshot" />;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Snapshot Turni</h2>
      </div>

      <div className={styles.filters}>
        <Select
          value={filterStatus}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterStatus(e.target.value as SnapshotStatus | '')}
        >
          <option value="">Tutti gli stati</option>
          <option value={SnapshotStatus.DRAFT}>Bozza</option>
          <option value={SnapshotStatus.PUBLISHED}>Pubblicato</option>
          <option value={SnapshotStatus.LOCKED}>Bloccato</option>
          <option value={SnapshotStatus.ARCHIVED}>Archiviato</option>
        </Select>

        <input
          type="date"
          value={filterStartDateFrom}
          onChange={(e) => setFilterStartDateFrom(e.target.value)}
          className={styles.dateInput}
          placeholder="Data inizio da"
        />

        <input
          type="date"
          value={filterStartDateTo}
          onChange={(e) => setFilterStartDateTo(e.target.value)}
          className={styles.dateInput}
          placeholder="Data inizio a"
        />

        {(filterStatus || filterStartDateFrom || filterStartDateTo) && (
          <button onClick={clearFilters} className={styles.clearButton}>
            Pulisci filtri
          </button>
        )}
      </div>

      {!snapshots || snapshots.length === 0 ? (
        <EmptyState
          title="Nessuno snapshot trovato"
          description="Non ci sono snapshot per questo locale."
        />
      ) : (
        <>
          <div className={styles.snapshotsList}>
            {snapshots.map((snapshot) => (
              <Link
                key={snapshot.id}
                href={`/dashboard/shift-snapshots/${snapshot.id}` as Route}
                className={styles.snapshotCard}
              >
                <div className={styles.cardVersion}>
                  <Calendar size={16} />
                  <span>v{snapshot.version}</span>
                </div>

                <div className={styles.cardMain}>
                  <div className={styles.cardTitle}>
                    {formatDate(snapshot.startDate)} - {formatDate(snapshot.endDate)}
                  </div>
                  <div className={styles.cardInfo}>
                    <div className={styles.cardStat}>
                      <Clock size={12} />
                      <span>{snapshot.totalShifts} turni</span>
                    </div>
                    <div className={styles.cardStat}>
                      <span>•</span>
                      <span>{snapshot.totalHours.toFixed(1)}h totali</span>
                    </div>
                    {snapshot.notes && (
                      <>
                        <span>•</span>
                        <span>{snapshot.notes}</span>
                      </>
                    )}
                  </div>
                </div>

                <div className={styles.cardStats}>
                  <div className={styles.stat}>
                    Creato: {formatDate(snapshot.createdAt)}
                  </div>
                  {snapshot.publishedAt && (
                    <div className={styles.stat}>
                      Pubb: {formatDate(snapshot.publishedAt)}
                    </div>
                  )}
                </div>

                {getStatusBadge(snapshot.status)}
              </Link>
            ))}
          </div>

          {total > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              pageSize={limit}
              totalItems={total}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setLimit(size);
                setPage(1);
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

