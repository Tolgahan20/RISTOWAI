'use client';

import { Calendar, Clock } from 'react-feather';
import { Button, Input } from '@/components/dashboard/ui';
import type { OpeningHours } from '../../types';
import { useOpeningHoursStep } from '../../hooks/useOpeningHoursStep';
import { DAYS } from '../../constants';
import styles from './opening-hours-step.module.css';

interface OpeningHoursStepProps {
  onSave: (data: { openingHours: OpeningHours }) => Promise<void>;
  isSaving: boolean;
  initialData?: { openingHours?: OpeningHours } | null;
}

export function OpeningHoursStep({ onSave, isSaving, initialData }: OpeningHoursStepProps) {
  const {
    openingHours,
    useSiesta,
    applyPreset,
    handleDayChange,
    toggleDay,
    handleSubmit,
  } = useOpeningHoursStep({ onSave, initialData });

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Orari di Apertura</h1>
        <p className={styles.description}>
          Configura gli orari di apertura del tuo locale (pranzo e cena con pausa siesta)
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Presets */}
          <div className={styles.presets}>
            <h3 className={styles.sectionTitle}>Preimpostazioni</h3>
            <div className={styles.presetButtons}>
              <button
                type="button"
                onClick={() => applyPreset('standard')}
                className={styles.presetButton}
              >
                <div>
                  <Calendar size={20}/>
                </div>
                <div className={styles.presetText}>
                  <div className={styles.presetName}>Tutti i giorni</div>
                  <div className={styles.presetDesc}>Lunedì - Domenica</div>
                </div>
              </button>
              <button
                type="button"
                onClick={() => applyPreset('weekdayOnly')}
                className={styles.presetButton}
              >
                <div>
                  <Clock size={20} />
                </div>
                <div className={styles.presetText}>
                  <div className={styles.presetName}>Solo giorni feriali</div>
                  <div className={styles.presetDesc}>Lunedì - Sabato</div>
                </div>
              </button>
            </div>
          </div>

          {/* Days */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Configura per giorno</h3>
            <div className={styles.days}>
              {DAYS.map(({ key, label }) => (
                <div key={key} className={styles.dayRow}>
                  <label className={styles.dayToggle}>
                    <input
                      type="checkbox"
                      checked={!!openingHours[key]}
                      onChange={() => toggleDay(key)}
                    />
                    <span className={styles.dayLabel}>{label}</span>
                  </label>

                  {openingHours[key] && (
                    <div className={styles.dayTimes}>
                      <div className={styles.timeGroup}>
                        <span className={styles.timeLabel}>Pranzo:</span>
                        <Input
                          type="time"
                          value={openingHours[key].open || ''}
                          onChange={(e) => handleDayChange(key, 'open', e.target.value)}
                        />
                        <span className={styles.timeSeparator}>-</span>
                        <Input
                          type="time"
                          value={openingHours[key].close || ''}
                          onChange={(e) => handleDayChange(key, 'close', e.target.value)}
                        />
                      </div>
                      {useSiesta && (
                        <div className={styles.timeGroup}>
                          <span className={styles.timeLabel}>Cena:</span>
                          <Input
                            type="time"
                            value={openingHours[key].open || ''}
                            onChange={(e) => handleDayChange(key, 'eveningOpen', e.target.value)}
                          />
                          <span className={styles.timeSeparator}>-</span>
                          <Input
                            type="time"
                            value={openingHours[key].close || ''}
                            onChange={(e) => handleDayChange(key, 'eveningClose', e.target.value)}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Button type="submit" disabled={isSaving} size="large" fullWidth>
            {isSaving ? 'Salvataggio...' : 'Continua'}
          </Button>
        </form>
      </div>
    </div>
  );
}

