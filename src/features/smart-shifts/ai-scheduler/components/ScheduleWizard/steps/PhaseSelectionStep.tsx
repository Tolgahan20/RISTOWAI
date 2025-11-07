'use client';

import React from 'react';
import { Clock, CheckSquare, Square, Users, Info } from 'react-feather';
import { LoadingState, Input } from '@/components/dashboard/ui';
import { usePhases } from '@/features/smart-shifts/phases/hooks/usePhases';
import type { PhaseOverride } from '../index';
import styles from './phase-selection-step.module.css';

interface PhaseSelectionStepProps {
  venueId: string;
  selectedPhaseIds: string[];
  phaseOverrides: PhaseOverride[];
  onUpdateSelection: (phaseIds: string[]) => void;
  onUpdateOverrides: (overrides: PhaseOverride[]) => void;
}

export const PhaseSelectionStep: React.FC<PhaseSelectionStepProps> = ({
  venueId,
  selectedPhaseIds,
  phaseOverrides,
  onUpdateSelection,
  onUpdateOverrides,
}) => {
  const { data: phases, isLoading } = usePhases(venueId);

  if (isLoading) {
    return <LoadingState message="Caricamento fasi..." />;
  }

  if (!phases || phases.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Clock size={48} />
        <p>Nessuna fase configurata per questo locale</p>
      </div>
    );
  }

  const allSelected = selectedPhaseIds.length === phases.length;
  const isPhaseSelected = (phaseId: string) => selectedPhaseIds.includes(phaseId);

  const handleToggleAll = () => {
    if (allSelected) {
      onUpdateSelection([]);
    } else {
      onUpdateSelection(phases.map((p) => p.id));
    }
  };

  const handleTogglePhase = (phaseId: string) => {
    if (isPhaseSelected(phaseId)) {
      onUpdateSelection(selectedPhaseIds.filter((id) => id !== phaseId));
      // Remove override when deselecting phase
      onUpdateOverrides(phaseOverrides.filter((o) => o.phaseId !== phaseId));
    } else {
      onUpdateSelection([...selectedPhaseIds, phaseId]);
    }
  };

  const handleOverrideChange = (phaseId: string, value: string) => {
    const numValue = parseInt(value, 10);
    if (isNaN(numValue) || numValue < 0) {
      // Remove override if invalid
      onUpdateOverrides(phaseOverrides.filter((o) => o.phaseId !== phaseId));
      return;
    }

    const existingIndex = phaseOverrides.findIndex((o) => o.phaseId === phaseId);
    if (existingIndex >= 0) {
      // Update existing override
      const updated = [...phaseOverrides];
      updated[existingIndex] = { phaseId, requiredStaff: numValue };
      onUpdateOverrides(updated);
    } else {
      // Add new override
      onUpdateOverrides([...phaseOverrides, { phaseId, requiredStaff: numValue }]);
    }
  };

  const getOverrideValue = (phaseId: string): number | undefined => {
    return phaseOverrides.find((o) => o.phaseId === phaseId)?.requiredStaff;
  };

  const getDefaultStaffCount = (phase: { roleRequirements?: unknown[] }): number => {
    if (!phase.roleRequirements || phase.roleRequirements.length === 0) return 1;
    return phase.roleRequirements.reduce((sum: number, req: unknown) => {
      // Handle both object and string types in roleRequirements
      if (typeof req === 'object' && req !== null && 'count' in req) {
        return sum + ((req as { count: number }).count || 1);
      }
      return sum + 1;
    }, 0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>
            <Clock size={20} />
            Configura Fasi di Lavoro
          </h3>
          <p className={styles.description}>
            Scegli quali fasi includere e, opzionalmente, sovrascrivi il numero di dipendenti necessari
          </p>
        </div>
        <button
          className={styles.selectAllButton}
          onClick={handleToggleAll}
        >
          {allSelected ? 'Deseleziona Tutto' : 'Seleziona Tutto'}
        </button>
      </div>

      <div className={styles.phaseGrid}>
        {phases.map((phase) => {
          const selected = isPhaseSelected(phase.id);
          const defaultCount = getDefaultStaffCount(phase);
          const overrideValue = getOverrideValue(phase.id);

          return (
            <div
              key={phase.id}
              className={`${styles.phaseCard} ${selected ? styles.selected : ''}`}
            >
              <div 
                className={styles.phaseMainContent}
                onClick={() => handleTogglePhase(phase.id)}
              >
                <div className={styles.checkbox}>
                  {selected ? (
                    <CheckSquare size={24} className={styles.checkedIcon} />
                  ) : (
                    <Square size={24} className={styles.uncheckedIcon} />
                  )}
                </div>
                <div className={styles.phaseInfo}>
                  <div className={styles.phaseName}>{phase.name}</div>
                  <div className={styles.phaseTime}>
                    {phase.startTime} - {phase.endTime}
                  </div>
                  <div className={styles.phaseDetails}>
                    <span className={`${styles.typeBadge} ${styles[phase.type.toLowerCase()]}`}>
                      {phase.type === 'HARD' ? 'Obbligatoria' : 'Opzionale'}
                    </span>
                    {phase.roleRequirements && phase.roleRequirements.length > 0 && (
                      <span className={styles.requirements}>
                        Default: {defaultCount} {defaultCount === 1 ? 'dipendente' : 'dipendenti'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Coverage Override */}
              {selected && (
                <div className={styles.overrideSection}>
                  <label className={styles.overrideLabel}>
                    <Users size={14} />
                    Dipendenti Necessari (Opzionale)
                  </label>
                  <Input
                    type="number"
                    min="1"
                    placeholder={`Default: ${defaultCount}`}
                    value={overrideValue !== undefined ? overrideValue : ''}
                    onChange={(e) => handleOverrideChange(phase.id, e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  {overrideValue !== undefined && overrideValue !== defaultCount && (
                    <div className={styles.overrideNote}>
                      {overrideValue > defaultCount ? (
                        <span className={styles.noteWarning}>
                          +{overrideValue - defaultCount} dipendenti in più del normale
                        </span>
                      ) : (
                        <span className={styles.noteInfo}>
                          -{defaultCount - overrideValue} dipendenti in meno del normale
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.infoBox}>
        <Info size={18} />
        <div>
          <strong>Note:</strong>
          <ul>
            <li>Le fasi &quot;Obbligatorie&quot; (HARD) devono sempre essere coperte dal personale disponibile</li>
            <li>Puoi sovrascrivere il numero di dipendenti necessari per questa settimana specifica</li>
            <li>Se lasci vuoto, verrà usato il numero predefinito basato sui ruoli richiesti</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
