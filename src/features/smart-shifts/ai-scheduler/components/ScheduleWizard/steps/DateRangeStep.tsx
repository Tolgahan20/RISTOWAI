'use client';

import React from 'react';
import { Calendar, Settings } from 'react-feather';
import { Input } from '@/components/dashboard/ui';
import { ScheduleModeSelector } from '../../ScheduleModeSelector';
import { SCHEDULE_MODE_OPTIONS } from '../../../constants';
import type { ScheduleMode } from '../../../types';
import styles from './date-range-step.module.css';

interface DateRangeStepProps {
  dateRange: { startDate: string; endDate: string };
  mode: ScheduleMode;
  onUpdate: (dateRange: { startDate: string; endDate: string }, mode: ScheduleMode) => void;
}

export const DateRangeStep: React.FC<DateRangeStepProps> = ({
  dateRange,
  mode,
  onUpdate,
}) => {
  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    onUpdate({ ...dateRange, [field]: value }, mode);
  };

  const handleModeChange = (newMode: ScheduleMode) => {
    onUpdate(dateRange, newMode);
  };

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <Calendar size={20} />
          <h3 className={styles.sectionTitle}>Seleziona Periodo</h3>
        </div>
        <p className={styles.sectionDescription}>
          Scegli le date per cui vuoi generare il piano turni
        </p>

        <div className={styles.dateInputs}>
          <div className={styles.dateField}>
            <label className={styles.label}>Data Inizio</label>
            <Input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              required
            />
          </div>
          <div className={styles.dateField}>
            <label className={styles.label}>Data Fine</label>
            <Input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              required
              min={dateRange.startDate}
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <Settings size={20} />
          <h3 className={styles.sectionTitle}>Modalità di Generazione</h3>
        </div>
        <p className={styles.sectionDescription}>
          Seleziona il tipo di ottimizzazione per il piano turni
        </p>

        <ScheduleModeSelector
          selectedMode={mode}
          onSelectMode={handleModeChange}
          options={SCHEDULE_MODE_OPTIONS}
        />
      </div>
    </div>
  );
};

