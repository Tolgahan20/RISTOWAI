'use client';

import { Input, Select, Button } from '@/components/dashboard/ui';
import type { PhaseType, WorkPhasesData } from '../../types';
import { useWorkPhasesStep } from '../../hooks/useWorkPhasesStep';
import styles from './work-phases-step.module.css';

interface WorkPhasesStepProps {
  onSave: (data: WorkPhasesData) => Promise<void>;
  isSaving: boolean;
  initialData?: WorkPhasesData | null;
}

export function WorkPhasesStep({ onSave, isSaving, initialData }: WorkPhasesStepProps) {
  const {
    phases,
    editingPhase,
    setEditingPhase,
    handleAddPhase,
    handleRemovePhase,
    handleUsePreset,
    handleSubmit,
    presets,
  } = useWorkPhasesStep({ onSave, initialData });

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Fasi di Lavoro</h1>
        <p className={styles.description}>
          Definisci le fasi operative del tuo locale (pranzo, cena, aperitivo, ecc.)
        </p>

        {/* Quick Presets */}
        <div className={styles.presets}>
          <p className={styles.presetsLabel}>Modelli rapidi:</p>
          <div className={styles.presetButtons}>
            {presets.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handleUsePreset(preset)}
                className={styles.presetButton}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        {/* Add Phase Form */}
        <div className={styles.addPhaseSection}>
          <div className={styles.formRow}>
            <Input
              type="text"
              placeholder="Nome fase (es. Pranzo)"
              value={editingPhase.name || ''}
              onChange={(e) => setEditingPhase({ ...editingPhase, name: e.target.value })}
            />
            <Input
              type="time"
              placeholder="Inizio"
              value={editingPhase.startTime || ''}
              onChange={(e) => setEditingPhase({ ...editingPhase, startTime: e.target.value })}
            />
            <Input
              type="time"
              placeholder="Fine"
              value={editingPhase.endTime || ''}
              onChange={(e) => setEditingPhase({ ...editingPhase, endTime: e.target.value })}
            />
            <Select
              value={editingPhase.type || 'HARD'}
              onChange={(e) => setEditingPhase({ ...editingPhase, type: e.target.value as PhaseType })}
            >
              <option value="HARD">Obbligatoria</option>
              <option value="SOFT">Flessibile</option>
            </Select>
            <button
              type="button"
              onClick={handleAddPhase}
              className={styles.addButton}
              disabled={!editingPhase.name || !editingPhase.startTime || !editingPhase.endTime}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Phases List */}
        {phases.length > 0 && (
          <div className={styles.phasesList}>
            <p className={styles.phasesLabel}>Fasi configurate ({phases.length}):</p>
            <div className={styles.phasesGrid}>
              {phases.map((phase, index) => (
                <div key={index} className={styles.phaseCard}>
                  <div className={styles.phaseHeader}>
                    <h3 className={styles.phaseName}>{phase.name}</h3>
                    <span className={`${styles.phaseType} ${styles[phase.type.toLowerCase()]}`}>
                      {phase.type === 'HARD' ? 'Obbligatoria' : 'Flessibile'}
                    </span>
                  </div>
                  <div className={styles.phaseTime}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"/>
                      <path d="M12 6v6l4 2"/>
                    </svg>
                    {phase.startTime} - {phase.endTime}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemovePhase(index)}
                    className={styles.removeButton}
                  >
                    Rimuovi
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submit */}
        <form onSubmit={handleSubmit}>
          <Button
            type="submit"
            disabled={isSaving || phases.length === 0}
            size="large"
            fullWidth
          >
            {isSaving ? 'Salvataggio...' : 'Continua'}
          </Button>
          {phases.length === 0 && (
            <p className={styles.error}>Aggiungi almeno una fase di lavoro</p>
          )}
        </form>
      </div>
    </div>
  );
}

