import React from 'react';
import { CheckCircle, XCircle } from 'react-feather';
import { useExportForm } from '../../hooks/useExportForm';
import styles from './export-form.module.css';

interface ExportFormProps {
  venueId: string;
  onSuccess?: () => void;
}

export const ExportForm: React.FC<ExportFormProps> = ({ venueId, onSuccess }) => {
  const {
    formData,
    updateField,
    isFormValid,
    validation,
    handleValidate,
    handleCreate,
    isValidating,
    isCreating,
  } = useExportForm({ venueId, onSuccess });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Crea Nuovo Export</h2>

      <div className={styles.form}>
        <div className={styles.row}>
          <div className={styles.field}>
            <label htmlFor="startDate" className={styles.label}>
              Data Inizio
            </label>
            <input
              type="date"
              id="startDate"
              value={formData.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="endDate" className={styles.label}>
              Data Fine
            </label>
            <input
              type="date"
              id="endDate"
              value={formData.endDate}
              onChange={(e) => updateField('endDate', e.target.value)}
              className={styles.input}
            />
          </div>
        </div>

        <div className={styles.field}>
          <label htmlFor="notes" className={styles.label}>
            Note (opzionale)
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => updateField('notes', e.target.value)}
            className={styles.textarea}
            rows={3}
            placeholder="Aggiungi note per questo export..."
          />
        </div>

        {validation && (
          <div className={styles.validation}>
            {validation.isValid ? (
              <div className={styles.validationSuccess}>
                <CheckCircle size={20} />
                <span>Validazione completata con successo</span>
              </div>
            ) : (
              <div className={styles.validationError}>
                <XCircle size={20} />
                <span>Errori di validazione</span>
              </div>
            )}

            {validation.errors.length > 0 && (
              <div className={styles.errorList}>
                <strong>Errori:</strong>
                <ul>
                  {validation.errors.map((error, idx) => (
                    <li key={idx}>{error}</li>
                  ))}
                </ul>
              </div>
            )}

            {validation.warnings.length > 0 && (
              <div className={styles.warningList}>
                <strong>Avvisi:</strong>
                <ul>
                  {validation.warnings.map((warning, idx) => (
                    <li key={idx}>{warning}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <div className={styles.actions}>
          <button
            type="button"
            onClick={handleValidate}
            disabled={!isFormValid || isValidating}
            className={styles.buttonSecondary}
          >
            {isValidating ? 'Validazione...' : 'Valida'}
          </button>

          <button
            type="button"
            onClick={handleCreate}
            disabled={!isFormValid || !validation?.isValid || isCreating}
            className={styles.buttonPrimary}
          >
            {isCreating ? 'Creazione...' : 'Crea Export'}
          </button>
        </div>
      </div>
    </div>
  );
};
