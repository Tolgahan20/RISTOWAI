import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Loader, Filter, Eye } from 'react-feather';
import { Button } from '@/components/dashboard/ui/Button';
import { Select } from '@/components/dashboard/ui/Select';
import { LoadingState, ErrorState } from '@/components/dashboard/ui';
import { useJobHistory } from '../../hooks/useJobHistory';
import { usePublishSchedule } from '../../hooks/usePublishSchedule';
import { useVenues, useVenueDetail } from '../../../venues/hooks';
import { useRestaurantId } from '@/features/auth/hooks/useRestaurantId';
import { useNotificationStore } from '../../../common/stores/notification';
import { AI_SCHEDULER_MESSAGES } from '../../../common/constants/messages';
import { ScheduleResults } from '../ScheduleResults';
import { JobStatus, ScheduleMode } from '../../types';
import type { ScheduleResponse, JobStatusResponse, PublishScheduleRequest, ShiftToPublish } from '../../types';
import styles from './job-history.module.css';

interface JobHistoryFilters {
  limit?: number;
  status?: string;
  venueId?: string;
  startDate?: string;
  endDate?: string;
}

export const JobHistory: React.FC = () => {
  const restaurantId = useRestaurantId() || '';
  const { showNotification } = useNotificationStore();
  const [filters, setFilters] = useState<JobHistoryFilters>({ limit: 20 });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<ScheduleResponse | null>(null);
  const [selectedJob, setSelectedJob] = useState<JobStatusResponse | null>(null);
  const { data: venues = [] } = useVenues();
  const { data: jobs, isLoading, isError, refetch } = useJobHistory(filters);

  // Get venue details for WhatsApp settings
  const venueId = selectedJob?.request?.venueId || '';
  const { data: venue } = useVenueDetail(restaurantId, venueId);
  const whatsAppEnabled = venue?.settings?.whatsapp?.enabled || false;

  const { publishSchedule, isPublishing } = usePublishSchedule({
    onSuccess: (data) => {
      showNotification({
        type: 'success',
        message: AI_SCHEDULER_MESSAGES.publishSuccess,
      });
      window.location.href = `/dashboard/smart-shifts/schedules/${venueId}/${data.scheduleId}`;
    },
    onError: (error) => {
      showNotification({
        type: 'error',
        message: `${AI_SCHEDULER_MESSAGES.publishError}: ${error}`,
      });
    },
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  const handleClearFilters = () => {
    setFilters({ limit: 20 });
  };

  const handleViewSchedule = (job: JobStatusResponse) => {
    if (job.result) {
      setSelectedSchedule(job.result);
      setSelectedJob(job);
    }
  };

  const handlePublish = (sendWhatsApp: boolean = false) => {
    if (!selectedSchedule || !selectedJob?.request) return;

    // Transform shifts to publish format
    const shiftsToPublish: ShiftToPublish[] = selectedSchedule.shifts.map((shift) => ({
      staffId: shift.staffId,
      phaseId: shift.phaseId,
      startTime: shift.startTime,
      endTime: shift.endTime,
    }));

    const publishRequest: PublishScheduleRequest = {
      venueId: selectedJob.request.venueId,
      startDate: selectedJob.request.dateRange.startDate,
      endDate: selectedJob.request.dateRange.endDate,
      shifts: shiftsToPublish,
      aiReasoning: selectedSchedule.metadata.aiReasoning,
      aiMode: selectedSchedule.metadata.mode,
      sendWhatsApp,
    };

    publishSchedule(publishRequest);
  };

  if (selectedSchedule) {
    return (
      <ScheduleResults
        schedule={selectedSchedule}
        onBack={() => {
          setSelectedSchedule(null);
          setSelectedJob(null);
        }}
        onPublish={handlePublish}
        isPublishing={isPublishing}
        whatsAppEnabled={whatsAppEnabled}
      />
    );
  }

  const getStatusIcon = (status: JobStatus) => {
    switch (status) {
      case JobStatus.COMPLETED:
        return <CheckCircle size={20} className={styles.iconCompleted} />;
      case JobStatus.FAILED:
        return <XCircle size={20} className={styles.iconFailed} />;
      case JobStatus.PROCESSING:
        return <Loader size={20} className={styles.iconProcessing} />;
      default:
        return <Clock size={20} className={styles.iconPending} />;
    }
  };

  const getStatusLabel = (status: JobStatus) => {
    switch (status) {
      case JobStatus.COMPLETED:
        return 'Completato';
      case JobStatus.FAILED:
        return 'Fallito';
      case JobStatus.PROCESSING:
        return 'In elaborazione';
      default:
        return 'In attesa';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('it-IT', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h2 className={styles.title}>Cronologia Generazioni</h2>
            <p className={styles.subtitle}>Ultimi lavori AI di generazione turni</p>
          </div>
          <Button onClick={() => setShowFilters(!showFilters)} variant="secondary" className={styles.filterButton}>
            <Filter size={18} />
            Filtri
          </Button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className={styles.filtersPanel}>
          <div className={styles.filtersRow}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Stato</label>
              <Select
                value={filters.status || ''}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">Tutti</option>
                <option value={JobStatus.COMPLETED}>Completato</option>
                <option value={JobStatus.FAILED}>Fallito</option>
                <option value={JobStatus.PROCESSING}>In elaborazione</option>
                <option value={JobStatus.PENDING}>In attesa</option>
              </Select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Locale</label>
              <Select
                value={filters.venueId || ''}
                onChange={(e) => handleFilterChange('venueId', e.target.value)}
              >
                <option value="">Tutti i locali</option>
                {venues.map((venue) => (
                  <option key={venue.id} value={venue.id}>
                    {venue.name}
                  </option>
                ))}
              </Select>
            </div>

            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Limite</label>
              <Select
                value={filters.limit?.toString() || '20'}
                onChange={(e) => handleFilterChange('limit', e.target.value)}
              >
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </Select>
            </div>
          </div>

          <Button onClick={handleClearFilters} variant="ghost" className={styles.clearButton}>
            Cancella filtri
          </Button>
        </div>
      )}

      {isLoading ? (
        <LoadingState message="Caricamento cronologia..." />
      ) : isError ? (
        <ErrorState message="Errore nel caricamento della cronologia" onRetry={refetch} retryLabel="Riprova" />
      ) : !jobs || jobs.length === 0 ? (
        <div className={styles.emptyStateContainer}>
          <div className={styles.emptyStateCard}>
            <div className={styles.emptyStateIcon}>
              <Clock size={64} />
            </div>
            <h3 className={styles.emptyStateTitle}>Nessuna generazione trovata</h3>
            <p className={styles.emptyStateText}>
              {filters.status || filters.venueId 
                ? 'Non ci sono generazioni che corrispondono ai filtri selezionati. Prova a modificare i filtri o cancellali per vedere tutte le generazioni.'
                : 'Le tue generazioni AI appariranno qui dopo aver creato il primo turno automatico.'}
            </p>
            {(filters.status || filters.venueId) && (
              <Button onClick={handleClearFilters} variant="secondary" className={styles.emptyStateButton}>
                Cancella filtri
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className={styles.jobList}>
        {jobs.map((job) => (
          <div key={job.jobId} className={styles.jobCard}>
            <div className={styles.jobHeader}>
              <div className={styles.statusBadge}>
                {getStatusIcon(job.status)}
                <span>{getStatusLabel(job.status)}</span>
              </div>
              <span className={styles.jobDate}>{formatDate(job.createdAt)}</span>
            </div>

            {job.request && (
              <div className={styles.jobDetails}>
                <div className={styles.detail}>
                  <span className={styles.detailLabel}>Periodo:</span>
                  <span className={styles.detailValue}>
                    {new Date(job.request.dateRange.startDate).toLocaleDateString('it-IT')} -{' '}
                    {new Date(job.request.dateRange.endDate).toLocaleDateString('it-IT')}
                  </span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.detailLabel}>Modalità:</span>
                  <span className={styles.detailValue}>
                    {job.request.mode === ScheduleMode.BALANCED ? 'Bilanciato' : 'Ottimizzato'}
                  </span>
                </div>
              </div>
            )}

            {job.status === JobStatus.FAILED && job.error && (
              <div className={styles.errorMessage}>
                <span className={styles.errorLabel}>Errore:</span>
                <span className={styles.errorText}>{job.error.message || 'Errore sconosciuto'}</span>
              </div>
            )}

            {job.status === JobStatus.COMPLETED && job.result && (
              <div className={styles.jobFooter}>
                <div className={styles.successMessage}>
                  ✓ {job.result.shifts?.length || 0} turni generati
                </div>
                <Button
                  onClick={() => handleViewSchedule(job)}
                  variant="secondary"
                  className={styles.viewButton}
                >
                  <Eye size={16} />
                  Visualizza Schedule
                </Button>
              </div>
            )}
          </div>
        ))}
        </div>
      )}
    </div>
  );
};

