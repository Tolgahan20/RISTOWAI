'use client';

import { Info, Loader } from 'react-feather';
import { Button, Input } from '@/components/dashboard/ui';
import { useScheduleGenerator } from '../../hooks/useScheduleGenerator';
import { SCHEDULE_MODE_OPTIONS } from '../../constants';
import { ScheduleModeSelector } from '../ScheduleModeSelector';
import { ScheduleResults } from '../ScheduleResults';
import styles from './schedule-generator.module.css';

interface ScheduleGeneratorProps {
  venueId: string;
}

export function ScheduleGenerator({ venueId }: ScheduleGeneratorProps) {
  const {
    showResults,
    schedule,
    formData,
    isStarting,
    isPolling,
    isPublishing,
    jobStatus,
    updateDateRange,
    updateMode,
    handleSubmit,
    handlePublish,
    handleBack,
  } = useScheduleGenerator({ venueId });

  if (showResults && schedule) {
    return (
      <ScheduleResults
        schedule={schedule}
        onBack={handleBack}
        onPublish={handlePublish}
        isPublishing={isPublishing}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>Generatore Turni AI</h1>
          <p className={styles.description}>
            Crea automaticamente un piano turni ottimizzato in base a fasi, personale e vincoli
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Date Range */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Periodo</h3>
            <div className={styles.dateRange}>
              <div className={styles.dateField}>
                <label className={styles.label}>Data Inizio</label>
                <Input
                  type="date"
                  value={formData.dateRange.startDate}
                  onChange={(e) => updateDateRange('startDate', e.target.value)}
                  required
                />
              </div>
              <div className={styles.dateField}>
                <label className={styles.label}>Data Fine</label>
                <Input
                  type="date"
                  value={formData.dateRange.endDate}
                  onChange={(e) => updateDateRange('endDate', e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Schedule Mode */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Modalità di Generazione</h3>
            <ScheduleModeSelector
              selectedMode={formData.mode}
              onSelectMode={updateMode}
              options={SCHEDULE_MODE_OPTIONS}
            />
          </div>

          {/* Generate Button */}
          <div className={styles.actions}>
            <Button
              type="submit"
              disabled={isStarting || isPolling}
              size="large"
              fullWidth
            >
              {isStarting ? (
                <>
                  <span className={styles.spinner} />
                  Avvio generazione...
                </>
              ) : isPolling ? (
                <>
                  <Loader className={styles.spinningIcon} size={20} />
                  Generazione in corso... ({jobStatus})
                </>
              ) : (
                'Genera Turni con AI'
              )}
            </Button>
          </div>

          {/* Info Box */}
          <div className={styles.infoBox}>
            <div className={styles.infoIcon}>
              <Info size={20} />
            </div>
            <div className={styles.infoText}>
              <strong>Come funziona:</strong> L&apos;AI analizzerà le tue fasi di lavoro,
              il personale disponibile e i vincoli contrattuali per creare un piano
              ottimizzato. Potrai sempre modificare i turni dopo la generazione.
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

