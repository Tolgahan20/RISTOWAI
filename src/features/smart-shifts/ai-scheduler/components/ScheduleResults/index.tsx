'use client';

import { Cpu, AlertTriangle } from 'react-feather';
import { Button } from '@/components/dashboard/ui';
import { ShiftCard } from '../ShiftCard';
import { ScheduleStats } from '../ScheduleStats';
import type { ScheduleResponse } from '../../types';
import styles from './schedule-results.module.css';

interface ScheduleResultsProps {
  schedule: ScheduleResponse;
  onBack: () => void;
  onPublish: () => void;
  isPublishing?: boolean;
}

export function ScheduleResults({ schedule, onBack, onPublish, isPublishing }: ScheduleResultsProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button variant="ghost" onClick={onBack} disabled={isPublishing}>
          ← Indietro
        </Button>
        <h1 className={styles.title}>Turni Generati</h1>
        <Button onClick={onPublish} disabled={isPublishing}>
          {isPublishing ? 'Pubblicazione...' : 'Pubblica Turni'}
        </Button>
      </div>

      {/* AI Reasoning */}
      {schedule.metadata.aiReasoning && (
        <div className={styles.reasoningBox}>
          <div className={styles.reasoningIcon}>
            <Cpu size={28} />
          </div>
          <div>
            <div className={styles.reasoningTitle}>Ragionamento AI</div>
            <div className={styles.reasoningText}>{schedule.metadata.aiReasoning}</div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <ScheduleStats metadata={schedule.metadata} />

      {/* Warnings */}
      {schedule.warnings && schedule.warnings.length > 0 && (
        <div className={styles.warningsBox}>
          <div className={styles.warningsTitle}>
            <AlertTriangle size={18} />
            Avvisi
          </div>
          <ul className={styles.warningsList}>
            {schedule.warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Shifts List */}
      <div className={styles.shiftsSection}>
        <h2 className={styles.sectionTitle}>
          Turni ({schedule.shifts.length})
        </h2>
        <div className={styles.shiftsList}>
          {schedule.shifts.map((shift) => (
            <ShiftCard key={shift.id} shift={shift} />
          ))}
        </div>
      </div>
    </div>
  );
}

