'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Calendar, Clock, Users, MapPin, Info } from 'react-feather';
import { Button } from '@/components/dashboard/ui/Button';
import { LoadingState, ErrorState } from '@/components/dashboard/ui';
import { useScheduleDetail } from '@/features/smart-shifts/schedules/hooks/useScheduleDetail';
import styles from './schedule-detail.module.css';

export default function ScheduleDetailPage() {
  const params = useParams();
  const router = useRouter();
  const venueId = params.venueId as string;
  const scheduleId = params.scheduleId as string;

  const { data: schedule, isLoading, isError, refetch } = useScheduleDetail(venueId, scheduleId);

  if (isLoading) {
    return <LoadingState message="Caricamento dettagli turno..." />;
  }

  if (isError || !schedule) {
    return (
      <ErrorState
        message="Errore nel caricamento dei dettagli del turno"
        onRetry={refetch}
        retryLabel="Riprova"
      />
    );
  }

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (timeString: string | Date) => {
    return new Date(timeString).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateDuration = (start: string | Date, end: string | Date) => {
    const startTime = new Date(start);
    const endTime = new Date(end);
    const hours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
    return hours.toFixed(1);
  };

  // Group shifts by date
  const shiftsByDate = schedule.shifts.reduce((acc, shift) => {
    const date = new Date(shift.startTime).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(shift);
    return acc;
  }, {} as Record<string, typeof schedule.shifts>);

  const sortedDates = Object.keys(shiftsByDate).sort();

  // Calculate totals
  const totalHours = schedule.shifts.reduce((sum, shift) => {
    return sum + parseFloat(calculateDuration(shift.startTime, shift.endTime));
  }, 0);

  const uniqueStaff = new Set(schedule.shifts.map((s) => s.staffId)).size;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return styles.statusPublished;
      case 'DRAFT':
        return styles.statusDraft;
      case 'ARCHIVED':
        return styles.statusArchived;
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Pubblicato';
      case 'DRAFT':
        return 'Bozza';
      case 'ARCHIVED':
        return 'Archiviato';
      default:
        return status;
    }
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Button variant="ghost" onClick={() => router.back()} className={styles.backButton}>
          <ArrowLeft size={18} />
          Indietro
        </Button>
      </div>

      {/* Schedule Info Card */}
      <div className={styles.infoCard}>
        <div className={styles.infoHeader}>
          <div>
            <h1 className={styles.title}>{schedule.name || 'Turno Senza Nome'}</h1>
            <div className={styles.subtitle}>
              <MapPin size={16} />
              <span>{schedule.venueName}</span>
            </div>
          </div>
          <div className={`${styles.statusBadge} ${getStatusColor(schedule.status)}`}>
            {getStatusLabel(schedule.status)}
          </div>
        </div>

        <div className={styles.infoGrid}>
          <div className={styles.infoItem}>
            <Calendar size={18} />
            <div>
              <div className={styles.infoLabel}>Periodo</div>
              <div className={styles.infoValue}>
                {formatDate(schedule.startDate)} - {formatDate(schedule.endDate)}
              </div>
            </div>
          </div>

          <div className={styles.infoItem}>
            <Users size={18} />
            <div>
              <div className={styles.infoLabel}>Personale Coinvolto</div>
              <div className={styles.infoValue}>{uniqueStaff} dipendenti</div>
            </div>
          </div>

          <div className={styles.infoItem}>
            <Clock size={18} />
            <div>
              <div className={styles.infoLabel}>Turni Totali</div>
              <div className={styles.infoValue}>
                {schedule.shifts.length} turni • {totalHours.toFixed(1)}h
              </div>
            </div>
          </div>
        </div>

        {schedule.notes && (
          <div className={styles.notesSection}>
            <div className={styles.notesHeader}>
              <Info size={16} />
              <span>Note</span>
            </div>
            <p className={styles.notesText}>{schedule.notes}</p>
          </div>
        )}

        {schedule.aiMetadata?.reasoning && (
          <div className={styles.aiSection}>
            <div className={styles.aiHeader}>
              <span className={styles.aiIcon}>🤖</span>
              <span>Ragionamento AI</span>
            </div>
            <p className={styles.aiText}>{schedule.aiMetadata.reasoning}</p>
          </div>
        )}
      </div>

      {/* Shifts by Date */}
      <div className={styles.shiftsContainer}>
        <h2 className={styles.shiftsTitle}>Turni per Giorno</h2>

        {sortedDates.map((date) => (
          <div key={date} className={styles.dateCard}>
            <div className={styles.dateHeader}>
              <Calendar size={18} />
              <span className={styles.dateTitle}>{formatDate(date)}</span>
              <span className={styles.dateCount}>{shiftsByDate[date].length} turni</span>
            </div>

            <div className={styles.shiftsList}>
              {shiftsByDate[date].map((shift) => (
                <div key={shift.id} className={styles.shiftCard}>
                  <div className={styles.shiftHeader}>
                    <div className={styles.shiftStaff}>
                      <Users size={16} />
                      <span className={styles.staffName}>{shift.staffName}</span>
                      <span className={styles.staffRole}>• {shift.staffRole}</span>
                    </div>
                    <div className={styles.shiftDuration}>
                      {calculateDuration(shift.startTime, shift.endTime)}h
                    </div>
                  </div>

                  <div className={styles.shiftBody}>
                    <div className={styles.shiftTime}>
                      <Clock size={14} />
                      <span>
                        {formatTime(shift.startTime)} - {formatTime(shift.endTime)}
                      </span>
                    </div>

                    {shift.phaseName && (
                      <div className={styles.shiftPhase}>
                        <span className={styles.phaseLabel}>Fase:</span>
                        <span className={styles.phaseName}>{shift.phaseName}</span>
                      </div>
                    )}

                    {shift.notes && (
                      <div className={styles.shiftNotes}>
                        <Info size={14} />
                        <span>{shift.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

