'use client';

import { Select, Button } from '@/components/dashboard/ui';
import type { TimeCaptureData } from '../../types';
import { useTimeCaptureStep } from '../../hooks/useTimeCaptureStep';
import styles from './time-capture-step.module.css';

interface TimeCaptureStepProps {
  onSave: (data: TimeCaptureData) => Promise<void>;
  isSaving: boolean;
  initialData?: TimeCaptureData | null;
}

export function TimeCaptureStep({ onSave, isSaving, initialData }: TimeCaptureStepProps) {
  const { formData, handleToggle, handleNumberChange, handleSubmit } =
    useTimeCaptureStep({ onSave, initialData });

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Rilevazione Presenze</h1>
        <p className={styles.description}>
          Configura come i dipendenti registreranno entrate e uscite
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Method Selection - QR Code Only for MVP */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Metodo di rilevazione</h3>
            <div className={styles.qrSection}>
              <div className={styles.qrIcon}>
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
              </div>
              <h4 className={styles.qrTitle}>Scansione QR Code</h4>
              <p className={styles.qrDesc}>
                I dipendenti scansionano il QR code del locale con il loro smartphone per timbrare entrate e uscite.
                Semplice, veloce e non richiede hardware aggiuntivo.
              </p>
              <div className={styles.qrFeatures}>
                <div className={styles.feature}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Nessun hardware necessario
                </div>
                <div className={styles.feature}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Setup immediato
                </div>
                <div className={styles.feature}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Geolocalizzazione inclusa
                </div>
              </div>
            </div>
          </div>

          {/* Options */}
          <div className={styles.section}>
            <h3 className={styles.sectionTitle}>Opzioni</h3>
            <div className={styles.optionsList}>
              <label className={styles.option}>
                <div className={styles.optionInfo}>
                  <div className={styles.optionName}>Ingresso anticipato</div>
                  <div className={styles.optionDesc}>Permetti timbratura in anticipo</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.allowEarlyClockIn}
                  onChange={() => handleToggle('allowEarlyClockIn')}
                  className={styles.toggle}
                />
              </label>

              {formData.allowEarlyClockIn && (
                <div className={styles.subOption}>
                  <label className={styles.subLabel}>Minuti di anticipo consentiti:</label>
                  <Select
                    value={formData.earlyClockInMinutes?.toString() || '15'}
                    onChange={(e) => handleNumberChange('earlyClockInMinutes', Number(e.target.value))}
                  >
                    <option value="5">5 minuti</option>
                    <option value="10">10 minuti</option>
                    <option value="15">15 minuti</option>
                    <option value="30">30 minuti</option>
                    <option value="60">60 minuti</option>
                  </Select>
                </div>
              )}

              <label className={styles.option}>
                <div className={styles.optionInfo}>
                  <div className={styles.optionName}>Uscita posticipata</div>
                  <div className={styles.optionDesc}>Permetti timbratura oltre &apos;orario previsto</div>
                </div>
                <input
                  type="checkbox"
                  checked={formData.allowLateClockOut}
                  onChange={() => handleToggle('allowLateClockOut')}
                  className={styles.toggle}
                />
              </label>

              {formData.allowLateClockOut && (
                <div className={styles.subOption}>
                  <label className={styles.subLabel}>Minuti di ritardo consentiti:</label>
                  <Select
                    value={formData.lateClockOutMinutes?.toString() || '30'}
                    onChange={(e) => handleNumberChange('lateClockOutMinutes', Number(e.target.value))}
                  >
                    <option value="15">15 minuti</option>
                    <option value="30">30 minuti</option>
                    <option value="60">60 minuti</option>
                    <option value="120">120 minuti</option>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Submit */}
          <Button type="submit" disabled={isSaving} size="large" fullWidth>
            {isSaving ? 'Completamento...' : 'Completa configurazione'}
          </Button>
        </form>
      </div>
    </div>
  );
}

