import React from 'react';
import { Calendar, Clock } from 'react-feather';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/ui';
import { useStaffSchedule } from '../../hooks/useStaffSchedule';
import styles from './staff-schedule-view.module.css';

interface StaffScheduleViewProps {
  staffId: string;
}

export const StaffScheduleView: React.FC<StaffScheduleViewProps> = ({ staffId }) => {
  const { data: schedule, isLoading, isError, refetch } = useStaffSchedule(staffId);

  if (isLoading) {
    return <LoadingState message="Caricamento turni..." />;
  }

  if (isError) {
    return <ErrorState message="Errore nel caricamento dei turni" onRetry={refetch} retryLabel="Riprova" />;
  }

  if (!schedule || !schedule.upcomingShifts || schedule.upcomingShifts.length === 0) {
    return (
      <EmptyState
        icon={<Calendar size={48} />}
        title="Nessun turno programmato"
        description="Non ci sono turni programmati per questo dipendente"
      />
    );
  }

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };


  const calculateDuration = (start: string, end: string) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    return hours.toFixed(1);
  };

  // Group shifts by week
  const getWeekKey = (dateString: string) => {
    const date = new Date(dateString);
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday
    return startOfWeek.toISOString().split('T')[0];
  };

  const getWeekDates = (weekStart: string) => {
    const dates = [];
    const start = new Date(weekStart);
    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date.toISOString().split('T')[0]);
    }
    return dates;
  };

  // Deduplicate shifts (same startTime, endTime, phaseId, phaseName)
  const deduplicatedShifts = schedule.upcomingShifts.reduce((acc, shift) => {
    const key = `${shift.startTime}-${shift.endTime}-${shift.phaseId}-${shift.phaseName}`;
    if (!acc.some(s => `${s.startTime}-${s.endTime}-${s.phaseId}-${s.phaseName}` === key)) {
      acc.push(shift);
    }
    return acc;
  }, [] as typeof schedule.upcomingShifts);

  // Group shifts by week and then by date
  const shiftsByWeek: Record<string, Record<string, typeof schedule.upcomingShifts>> = {};
  
  deduplicatedShifts.forEach((shift) => {
    const date = shift.startTime.split('T')[0];
    const weekKey = getWeekKey(date);
    
    if (!shiftsByWeek[weekKey]) {
      shiftsByWeek[weekKey] = {};
    }
    if (!shiftsByWeek[weekKey][date]) {
      shiftsByWeek[weekKey][date] = [];
    }
    shiftsByWeek[weekKey][date].push(shift);
  });

  const sortedWeeks = Object.keys(shiftsByWeek).sort();

  const getDayName = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', { weekday: 'short' });
  };

  const getDayNumber = (dateString: string) => {
    return new Date(dateString).getDate();
  };

  const getMonthName = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', { month: 'short' });
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h2 className={styles.title}>Turni di {schedule.staffName}</h2>
          <div className={styles.statsRow}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Turni programmati</span>
              <span className={styles.statValue}>{deduplicatedShifts.length}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Questa settimana</span>
              <span className={styles.statValue}>{schedule.totalHoursThisWeek.toFixed(1)}h</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Prossima settimana</span>
              <span className={styles.statValue}>{schedule.totalHoursNextWeek.toFixed(1)}h</span>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.calendarContainer}>
        {sortedWeeks.map((weekStart) => {
          const weekDates = getWeekDates(weekStart);
          
          return (
            <div key={weekStart} className={styles.weekSection}>
              <div className={styles.weekHeader}>
                Settimana del {new Date(weekStart).toLocaleDateString('it-IT', { day: 'numeric', month: 'long' })}
              </div>
              
              <div className={styles.calendarGrid}>
                {weekDates.map((date) => {
                  const dayShifts = shiftsByWeek[weekStart]?.[date] || [];
                  const isToday = date === new Date().toISOString().split('T')[0];
                  const hasShifts = dayShifts.length > 0;

                  return (
                    <div 
                      key={date} 
                      className={`${styles.dayCell} ${isToday ? styles.today : ''} ${!hasShifts ? styles.emptyDay : ''}`}
                    >
                      <div className={styles.dayHeader}>
                        <span className={styles.dayName}>{getDayName(date)}</span>
                        <span className={styles.dayNumber}>{getDayNumber(date)}</span>
                        <span className={styles.monthName}>{getMonthName(date)}</span>
                      </div>

                      <div className={styles.dayShifts}>
                        {dayShifts.map((shift) => (
                          <div key={shift.id} className={styles.shiftItem}>
                            <div className={styles.shiftTimeCompact}>
                              <Clock size={14} />
                              <span>{formatTime(shift.startTime)} - {formatTime(shift.endTime)}</span>
                            </div>
                            {shift.phaseName && (
                              <div className={styles.shiftPhaseCompact}>
                                {shift.phaseName}
                              </div>
                            )}
                            <div className={styles.shiftDuration}>
                              {calculateDuration(shift.startTime, shift.endTime)}h
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

