'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight, Calendar } from 'react-feather';
import { Button, LoadingState, ErrorState, EmptyState } from '@/components/dashboard/ui';
import { VenueSelector } from '@/features/smart-shifts/ai-scheduler/components/VenueSelector';
import { WeeklyScheduleGrid } from '@/features/smart-shifts/schedules/components/WeeklyScheduleGrid';
import { useVenueSelection } from '@/features/smart-shifts/ai-scheduler/hooks/useVenueSelection';
import { useWeeklySchedule } from '@/features/smart-shifts/schedules/hooks/useWeeklySchedule';
import { useWeekNavigation } from '@/features/smart-shifts/schedules/hooks/useWeekNavigation';
import { SCHEDULES_MESSAGES } from '@/features/smart-shifts/common/constants/messages';
import { useNotificationStore } from '@/features/smart-shifts/common/stores/notification';
import styles from './schedules.module.css';

export default function SchedulesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showNotification } = useNotificationStore();
  const {
    venues,
    selectedVenueId,
    setSelectedVenueId,
    isLoading: isLoadingVenues,
  } = useVenueSelection();
  const {
    currentWeekStart,
    goToPreviousWeek,
    goToNextWeek,
    goToCurrentWeek,
  } = useWeekNavigation();

  // Check if redirected from AI Scheduler publish
  useEffect(() => {
    const scheduleId = searchParams.get('scheduleId');
    if (scheduleId) {
      showNotification({
        type: 'success',
        message: 'Turni pubblicati con successo!',
      });
    }
  }, [searchParams, showNotification]);

  // Fetch weekly schedule
  const {
    data: weeklySchedule,
    isLoading: isLoadingSchedule,
    error,
  } = useWeeklySchedule(selectedVenueId, currentWeekStart);

  // Show error notification
  useEffect(() => {
    if (error) {
      showNotification({
        type: 'error',
        message: SCHEDULES_MESSAGES.error.loadFailed,
      });
    }
  }, [error, showNotification]);

  // Format week display
  const formatWeekDisplay = () => {
    if (!weeklySchedule) return '';
    return SCHEDULES_MESSAGES.week.format(
      weeklySchedule.weekNumber,
      weeklySchedule.year,
    );
  };

  // Show venue selector if no venue is selected
  if (!selectedVenueId) {
    return (
      <VenueSelector
        venues={venues}
        selectedVenueId={selectedVenueId}
        onSelectVenue={setSelectedVenueId}
        isLoading={isLoadingVenues}
      />
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{SCHEDULES_MESSAGES.title}</h1>
          {weeklySchedule && (
            <p className={styles.subtitle}>{formatWeekDisplay()}</p>
          )}
        </div>

        {/* Week Navigation */}
        <div className={styles.navigation}>
          <Button
            variant="ghost"
            onClick={goToPreviousWeek}
            disabled={isLoadingSchedule}
          >
            <ChevronLeft size={20} />
            {SCHEDULES_MESSAGES.navigation.previous}
          </Button>
          <Button
            variant="ghost"
            onClick={goToCurrentWeek}
            disabled={isLoadingSchedule}
          >
            <Calendar size={18} />
            {SCHEDULES_MESSAGES.navigation.today}
          </Button>
          <Button
            variant="ghost"
            onClick={goToNextWeek}
            disabled={isLoadingSchedule}
          >
            {SCHEDULES_MESSAGES.navigation.next}
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      {/* Venue Selector (if multiple venues) */}
      {venues.length > 1 && (
        <div className={styles.venueSelector}>
          <label>{SCHEDULES_MESSAGES.venue.label}</label>
          <select
            value={selectedVenueId}
            onChange={(e) => setSelectedVenueId(e.target.value)}
            className={styles.venueSelect}
          >
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Loading State */}
      {isLoadingSchedule && <LoadingState message={SCHEDULES_MESSAGES.loading} />}

      {/* Error State */}
      {error && (
        <ErrorState
          message={SCHEDULES_MESSAGES.error.loadFailed}
          onRetry={() => window.location.reload()}
          retryLabel={SCHEDULES_MESSAGES.error.retry}
        />
      )}

      {/* Schedule Grid */}
      {weeklySchedule && !isLoadingSchedule && (
        <>
          {weeklySchedule.shifts.length > 0 ? (
            <WeeklyScheduleGrid schedule={weeklySchedule} />
          ) : (
            <EmptyState
              icon={<Calendar size={48} />}
              title={SCHEDULES_MESSAGES.empty.title}
              description={SCHEDULES_MESSAGES.empty.description}
              action={{
                label: SCHEDULES_MESSAGES.empty.action,
                onClick: () => void router.push('/dashboard/ai-scheduler' as any),
              }}
            />
          )}
        </>
      )}
    </div>
  );
}

