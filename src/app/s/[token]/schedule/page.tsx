'use client';

import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { staffSchedulesApi } from '@/features/smart-shifts/staff-portal/api/schedules';
import { StaffShiftsCalendar } from '@/features/smart-shifts/staff-portal/components/StaffShiftsCalendar';
import { LoadingState } from '@/components/dashboard/ui';
import { ErrorState } from '@/components/dashboard/ui';
import styles from './schedule.module.css';

export default function StaffSchedulePage() {
  const params = useParams();
  const token = params.token as string;

  // Fetch schedule using staff token (no auth required)
  const { data: schedule, isLoading, isError, refetch } = useQuery({
    queryKey: ['staffScheduleByToken', token],
    queryFn: () => staffSchedulesApi.getScheduleByToken(token),
    enabled: !!token,
  });

  if (isLoading) {
    return (
      <div className={styles.container}>
        <LoadingState message="Caricamento turni..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className={styles.container}>
        <ErrorState 
          message="Link non valido o scaduto. Contatta il tuo manager per ottenere un nuovo link."
          onRetry={refetch}
          retryLabel="Riprova"
        />
      </div>
    );
  }

  if (!schedule || !schedule.upcomingShifts || schedule.upcomingShifts.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <h2>Nessun Turno Programmato</h2>
          <p>Non hai turni programmati per le prossime settimane.</p>
          <p>Contatta il tuo manager per maggiori informazioni.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>I Miei Turni</h1>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Questa Settimana</span>
            <span className={styles.statValue}>
              {schedule.totalHoursThisWeek.toFixed(1)}h
            </span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Prossima Settimana</span>
            <span className={styles.statValue}>
              {schedule.totalHoursNextWeek.toFixed(1)}h
            </span>
          </div>
        </div>
      </div>
      <StaffShiftsCalendar shifts={schedule.upcomingShifts} />
    </div>
  );
}

