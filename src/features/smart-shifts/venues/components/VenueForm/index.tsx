import React from 'react';
import { Input } from '@/components/dashboard/ui/Input';
import { Select } from '@/components/dashboard/ui/Select';
import { Button } from '@/components/dashboard/ui/Button';
import { AddressAutocomplete } from '@/components/dashboard/ui/AddressAutocomplete';
import { useVenueForm } from '../../hooks';
import { VenueType, VENUE_TYPE_LABELS, DAYS_OF_WEEK } from '../../types';
import type { Venue } from '../../types';
import styles from './venue-form.module.css';

interface VenueFormProps {
  venue?: Venue;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const DAY_LABELS: Record<string, string> = {
  monday: 'Lunedì',
  tuesday: 'Martedì',
  wednesday: 'Mercoledì',
  thursday: 'Giovedì',
  friday: 'Venerdì',
  saturday: 'Sabato',
  sunday: 'Domenica',
};

export const VenueForm: React.FC<VenueFormProps> = ({ venue, onSuccess, onCancel }) => {
  const {
    formData,
    updateField,
    updateOpeningHours,
    removeOpeningHours,
    updateSettings,
    handleSubmit,
    isSubmitting,
    isEditing,
  } = useVenueForm(venue);

  const onSubmit = async (e: React.FormEvent) => {
    await handleSubmit(e);
    if (onSuccess) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Informazioni Base</h3>
        
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>
            Nome Locale <span className={styles.required}>*</span>
          </label>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Es. Ristorante La Bella Vista"
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="type" className={styles.label}>
            Tipo <span className={styles.required}>*</span>
          </label>
          <Select
            id="type"
            value={formData.type}
            onChange={(e) => updateField('type', e.target.value as VenueType)}
            required
          >
            {Object.entries(VENUE_TYPE_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        <div className={styles.field}>
          <label htmlFor="address" className={styles.label}>
            Indirizzo
          </label>
          <AddressAutocomplete
            value={formData.address}
            onChange={(value) => updateField('address', value)}
            placeholder="Via Roma 123, Milano"
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="timezone" className={styles.label}>
            Fuso Orario <span className={styles.required}>*</span>
          </label>
          <Select
            id="timezone"
            value={formData.timezone}
            onChange={(e) => updateField('timezone', e.target.value)}
            required
          >
            <option value="Europe/Rome">Europe/Rome (GMT+1)</option>
            <option value="Europe/Paris">Europe/Paris (GMT+1)</option>
            <option value="Europe/London">Europe/London (GMT+0)</option>
            <option value="Europe/Berlin">Europe/Berlin (GMT+1)</option>
          </Select>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Orari di Apertura</h3>
        <p className={styles.sectionDescription}>
          Imposta gli orari di apertura per ogni giorno della settimana
        </p>

        <div className={styles.openingHours}>
          {DAYS_OF_WEEK.map((day) => {
            const hours = formData.openingHours[day];
            const isOpen = !!hours;

            return (
              <div key={day} className={styles.dayRow}>
                <div className={styles.dayLabel}>{DAY_LABELS[day]}</div>
                
                {isOpen ? (
                  <div className={styles.timeInputs}>
                    <Input
                      type="time"
                      value={hours.open}
                      onChange={(e) => updateOpeningHours(day, e.target.value, hours.close)}
                      className={styles.timeInput}
                    />
                    <span className={styles.timeSeparator}>-</span>
                    <Input
                      type="time"
                      value={hours.close}
                      onChange={(e) => updateOpeningHours(day, hours.open, e.target.value)}
                      className={styles.timeInput}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => removeOpeningHours(day)}
                      className={styles.removeButton}
                    >
                      Chiuso
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => updateOpeningHours(day, '09:00', '22:00')}
                    className={styles.addButton}
                  >
                    + Aggiungi Orario
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Impostazioni Turni</h3>
        <p className={styles.sectionDescription}>
          Configura le impostazioni per la gestione dei turni
        </p>

        <div className={styles.settingsGrid}>
          <div className={styles.field}>
            <label htmlFor="minRestHours" className={styles.label}>
              Ore di Riposo Minime
            </label>
            <Input
              id="minRestHours"
              type="number"
              min="0"
              max="24"
              value={formData.settings.minRestHours || 11}
              onChange={(e) => updateSettings('minRestHours', parseInt(e.target.value))}
            />
            <span className={styles.fieldHelp}>Ore minime tra turni (default: 11)</span>
          </div>

          <div className={styles.field}>
            <label htmlFor="maxDailyHours" className={styles.label}>
              Ore Giornaliere Massime
            </label>
            <Input
              id="maxDailyHours"
              type="number"
              min="0"
              max="24"
              value={formData.settings.maxDailyHours || 12}
              onChange={(e) => updateSettings('maxDailyHours', parseInt(e.target.value))}
            />
            <span className={styles.fieldHelp}>Ore massime per giorno (default: 12)</span>
          </div>

          <div className={styles.field}>
            <label htmlFor="breakDuration" className={styles.label}>
              Durata Pausa (minuti)
            </label>
            <Input
              id="breakDuration"
              type="number"
              min="0"
              max="120"
              step="5"
              value={formData.settings.breakDuration || 30}
              onChange={(e) => updateSettings('breakDuration', parseInt(e.target.value))}
            />
            <span className={styles.fieldHelp}>Durata pausa in minuti (default: 30)</span>
          </div>

          <div className={styles.field}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={formData.settings.enablePunchClock || false}
                onChange={(e) => updateSettings('enablePunchClock', e.target.checked)}
                className={styles.checkbox}
              />
              <span>Abilita Rilevazione Presenze</span>
            </label>
            <span className={styles.fieldHelp}>Consenti ai dipendenti di timbrare entrata/uscita</span>
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={isSubmitting}>
            Annulla
          </Button>
        )}
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Salvataggio...' : isEditing ? 'Aggiorna Locale' : 'Crea Locale'}
        </Button>
      </div>
    </form>
  );
};

