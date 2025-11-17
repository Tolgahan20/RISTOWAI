'use client';

import { Calendar, Clock, Users, Eye } from 'react-feather';
import { Button } from '@/components/dashboard/ui/Button';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/ui';
import { Select } from '@/components/dashboard/ui/Select';
import { useSchedulesList } from '@/features/smart-shifts/schedules/hooks';
import styles from './schedules-list.module.css';

export default function SchedulesListPage() {
  const {
    venues,
    isLoadingVenues,
    selectedVenueId,
    setSelectedVenueId,
    schedules,
    isLoading,
    isError,
    refetch,
    formatDate,
    getStatusColor,
    getStatusLabel,
    navigateToDetail,
    navigateToGenerator,
  } = useSchedulesList();

  if (isLoadingVenues) {
    return <LoadingState message="Caricamento..." />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>Tutti i Turni</h1>
            <p className={styles.subtitle}>Visualizza e gestisci tutti i turni pubblicati</p>
          </div>
          <div className={styles.compactVenueSelector}>
            <label className={styles.selectorLabel}>Locale:</label>
            <Select
              value={selectedVenueId || ''}
              onChange={(e) => setSelectedVenueId(e.target.value)}
              className={styles.venueSelect}
            >
              <option value="" disabled>
                Seleziona un locale
              </option>
              {venues.map((venue) => (
                <option key={venue.id} value={venue.id}>
                  {venue.name}
                </option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {!selectedVenueId ? (
        <EmptyState
          icon={<Calendar size={48} />}
          title="Seleziona un locale"
          description="Scegli un locale per visualizzare i turni"
        />
      ) : isLoading ? (
        <LoadingState message="Caricamento turni..." />
      ) : isError ? (
        <ErrorState message="Errore nel caricamento dei turni" onRetry={refetch} retryLabel="Riprova" />
      ) : !schedules || schedules.length === 0 ? (
        <EmptyState
          icon={<Calendar size={48} />}
          title="Nessun turno trovato"
          description="Non ci sono turni pubblicati per questo locale"
          action={{ label: 'Genera Turni', onClick: navigateToGenerator }}
        />
      ) : (
        <div className={styles.schedulesList}>
          {schedules.map((schedule) => (
            <div key={schedule.id} className={styles.scheduleCard}>
              <div className={styles.cardHeader}>
                <div>
                  <h3 className={styles.scheduleName}>{schedule.name || 'Turno Senza Nome'}</h3>
                  <div className={styles.scheduleMeta}>
                    <Calendar size={14} />
                    <span>
                      {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
                    </span>
                  </div>
                </div>
                <div className={`${styles.statusBadge} ${styles[getStatusColor(schedule.status)]}`}>
                  {getStatusLabel(schedule.status)}
                </div>
              </div>

              <div className={styles.cardStats}>
                <div className={styles.stat}>
                  <Users size={16} />
                  <span>{schedule.shifts.length} turni</span>
                </div>
                <div className={styles.stat}>
                  <Clock size={16} />
                  <span>
                    {schedule.shifts
                      .reduce((sum, shift) => {
                        const start = new Date(shift.startTime);
                        const end = new Date(shift.endTime);
                        return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60);
                      }, 0)
                      .toFixed(1)}
                    h
                  </span>
                </div>
              </div>

              <Button
                onClick={() => navigateToDetail(schedule.id)}
                variant="secondary"
                className={styles.viewButton}
              >
                <Eye size={16} />
                Visualizza Dettagli
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

