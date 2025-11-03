'use client';

import { Input, Button } from '@/components/dashboard/ui';
import type { HolidayCalendarData } from '../../types';
import { useHolidayCalendarStep } from '../../hooks/useHolidayCalendarStep';
import styles from './holiday-calendar-step.module.css';

interface HolidayCalendarStepProps {
  onSave: (data: HolidayCalendarData) => Promise<void>;
  isSaving: boolean;
  initialData?: HolidayCalendarData | null;
}

export function HolidayCalendarStep({ onSave, isSaving, initialData }: HolidayCalendarStepProps) {
  const {
    holidays,
    editingHoliday,
    setEditingHoliday,
    handleAddHoliday,
    handleRemoveHoliday,
    handleLoadPreset,
    handleSubmit,
    handleSkip,
  } = useHolidayCalendarStep({ onSave, initialData });

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Calendario Festività</h1>
        <p className={styles.description}>
          Definisci i giorni di chiusura e le festività nazionali
        </p>

        {/* Quick Load Italian Holidays */}
        <div className={styles.presetSection}>
          <button
            type="button"
            onClick={handleLoadPreset}
            className={styles.presetButton}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            Carica festività italiane 2025
          </button>
        </div>

        {/* Add Holiday Form */}
        <div className={styles.addSection}>
          <div className={styles.formRow}>
            <Input
              type="date"
              value={editingHoliday.date || ''}
              onChange={(e) => setEditingHoliday({ ...editingHoliday, date: e.target.value })}
              placeholder="Data"
            />
            <Input
              type="text"
              value={editingHoliday.name || ''}
              onChange={(e) => setEditingHoliday({ ...editingHoliday, name: e.target.value })}
              placeholder="Nome festività"
            />
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={editingHoliday.isPaid ?? true}
                onChange={(e) => setEditingHoliday({ ...editingHoliday, isPaid: e.target.checked })}
              />
              <span>Retribuita</span>
            </label>
            <button
              type="button"
              onClick={handleAddHoliday}
              className={styles.addButton}
              disabled={!editingHoliday.date || !editingHoliday.name}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Holidays List */}
        {holidays.length > 0 && (
          <div className={styles.holidaysList}>
            <p className={styles.holidaysLabel}>Festività configurate ({holidays.length}):</p>
            <div className={styles.holidaysGrid}>
              {holidays
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((holiday, index) => (
                  <div key={index} className={styles.holidayCard}>
                    <div className={styles.holidayInfo}>
                      <div className={styles.holidayDate}>
                        {new Date(holiday.date).toLocaleDateString('it-IT', {
                          day: '2-digit',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </div>
                      <div className={styles.holidayName}>{holiday.name}</div>
                      <div className={styles.holidayMeta}>
                        {holiday.isPaid ? (
                          <span className={styles.paid}>✓ Retribuita</span>
                        ) : (
                          <span className={styles.unpaid}>Non retribuita</span>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveHoliday(index)}
                      className={styles.removeButton}
                    >
                      ×
                    </button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <form onSubmit={handleSubmit} className={styles.actions}>
          <Button
            type="button"
            variant="secondary"
            onClick={handleSkip}
            disabled={isSaving}
          >
            Salta per ora
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
            fullWidth
          >
            {isSaving ? 'Salvataggio...' : 'Continua'}
          </Button>
        </form>
      </div>
    </div>
  );
}

