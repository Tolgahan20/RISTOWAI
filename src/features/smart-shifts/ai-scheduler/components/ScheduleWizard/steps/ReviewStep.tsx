'use client';

import React from 'react';
import { Calendar, Settings, Clock, Users, AlertCircle, CheckCircle } from 'react-feather';
import { useStaffAvailability } from '../../../hooks/useStaffAvailability';
import { usePhases } from '@/features/smart-shifts/phases/hooks/usePhases';
import { SCHEDULE_MODE_OPTIONS } from '../../../constants';
import type { ScheduleMode } from '../../../types';
import styles from './review-step.module.css';

interface PhaseOverride {
  phaseId: string;
  requiredStaff: number;
}

interface ReviewStepProps {
  venueId: string;
  dateRange: { startDate: string; endDate: string };
  mode: ScheduleMode;
  selectedStaffIds: string[];
  selectedPhaseIds: string[];
  phaseOverrides: PhaseOverride[];
}

export const ReviewStep: React.FC<ReviewStepProps> = ({
  venueId,
  dateRange,
  mode,
  selectedStaffIds,
  selectedPhaseIds,
  phaseOverrides,
}) => {
  const { data: availability } = useStaffAvailability(
    { venueId, startDate: dateRange.startDate, endDate: dateRange.endDate },
    true,
  );

  const { data: allPhases } = usePhases(venueId);

  const selectedPhases = allPhases?.filter((p) =>
    selectedPhaseIds.length === 0 ? true : selectedPhaseIds.includes(p.id)
  ) || [];

  const modeOption = SCHEDULE_MODE_OPTIONS.find((opt) => opt.value === mode);

  const calculateDays = () => {
    const start = new Date(dateRange.startDate);
    const end = new Date(dateRange.endDate);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff + 1;
  };

  const hasWarnings = availability && availability.unavailableCount > availability.availableCount;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Revisione Configurazione</h2>
        <p className={styles.subtitle}>
          Controlla tutti i dettagli prima di generare i turni con l&apos;AI
        </p>
      </div>

      {/* Warnings */}
      {hasWarnings && (
        <div className={styles.warningCard}>
          <AlertCircle size={24} />
          <div>
            <div className={styles.warningTitle}>Attenzione</div>
            <div className={styles.warningText}>
              Ci sono più dipendenti non disponibili ({availability?.unavailableCount}) che
              disponibili ({availability?.availableCount}) nel periodo selezionato. La generazione
              potrebbe non riuscire a coprire tutte le fasi.
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        {/* Date Range */}
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>
            <Calendar size={24} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardLabel}>Periodo</div>
            <div className={styles.cardValue}>
              {new Date(dateRange.startDate).toLocaleDateString('it-IT')} -{' '}
              {new Date(dateRange.endDate).toLocaleDateString('it-IT')}
            </div>
            <div className={styles.cardMeta}>{calculateDays()} giorni</div>
          </div>
        </div>

        {/* Mode */}
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>
            <Settings size={24} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardLabel}>Modalità</div>
            <div className={styles.cardValue}>{modeOption?.label || mode}</div>
            <div className={styles.cardMeta}>{modeOption?.description}</div>
          </div>
        </div>

        {/* Staff Selection */}
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>
            <Users size={24} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardLabel}>Dipendenti Selezionati</div>
            <div className={styles.cardValue}>
              {selectedStaffIds.length === 0 ? 'Tutti' : selectedStaffIds.length}
            </div>
            <div className={styles.cardMeta}>
              {selectedStaffIds.length === 0
                ? `${availability?.totalStaff || 0} dipendenti totali`
                : `su ${availability?.totalStaff || 0} totali`}
            </div>
          </div>
        </div>

        {/* Phases */}
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>
            <Clock size={24} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardLabel}>Fasi Selezionate</div>
            <div className={styles.cardValue}>
              {selectedPhaseIds.length === 0 ? 'Tutte' : selectedPhases.length}
            </div>
            <div className={styles.cardMeta}>
              {selectedPhaseIds.length === 0
                ? `${allPhases?.length || 0} fasi totali`
                : `su ${allPhases?.length || 0} totali`}
              {phaseOverrides.length > 0 && ` • ${phaseOverrides.length} personalizzate`}
            </div>
          </div>
        </div>
      </div>

      {/* Phase Details */}
      {selectedPhases.length > 0 && (
        <div className={styles.detailsCard}>
          <h3 className={styles.detailsTitle}>
            <Clock size={18} />
            Dettagli Fasi
          </h3>
          <div className={styles.phaseList}>
            {selectedPhases.map((phase) => {
              const override = phaseOverrides.find((o) => o.phaseId === phase.id);
              return (
                <div key={phase.id} className={styles.phaseItem}>
                  <div className={styles.phaseName}>{phase.name}</div>
                  <div className={styles.phaseTime}>
                    {phase.startTime} - {phase.endTime}
                  </div>
                  <span className={`${styles.typeBadge} ${styles[phase.type.toLowerCase()]}`}>
                    {phase.type === 'HARD' ? 'Obbligatoria' : 'Opzionale'}
                  </span>
                  {override && (
                    <span className={styles.overrideBadge}>
                      {override.requiredStaff} dipendenti richiesti
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Success Message */}
      {!hasWarnings && availability && (
        <div className={styles.successCard}>
          <CheckCircle size={24} />
          <div>
            <div className={styles.successTitle}>Tutto Pronto!</div>
            <div className={styles.successText}>
              La configurazione sembra buona. Clicca su &quot;Genera Turni con AI&quot; per avviare
              la generazione automatica del piano turni.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

