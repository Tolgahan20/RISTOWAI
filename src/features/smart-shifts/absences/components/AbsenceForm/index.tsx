'use client';

import React from 'react';
import { Button } from '@/components/dashboard/ui/Button';
import { Input } from '@/components/dashboard/ui/Input';
import { Select } from '@/components/dashboard/ui/Select';
import { useAbsenceForm } from '../../hooks';
import { ABSENCE_CODE_LABELS, AbsenceCode } from '../../types';
import type { Absence } from '../../types';
import styles from './absence-form.module.css';

interface AbsenceFormProps {
  venueId: string;
  absence?: Absence;
  staffList: Array<{ id: string; name: string }>;
  onSuccess: () => void;
  onCancel: () => void;
}

export const AbsenceForm: React.FC<AbsenceFormProps> = ({
  venueId,
  absence,
  staffList,
  onSuccess,
  onCancel,
}) => {
  const { formData, updateField, handleSubmit, isSubmitting } = useAbsenceForm(venueId, absence);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
    onSuccess();
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Informazioni Base</h3>

        <div className={styles.field}>
          <label className={styles.label}>
            Dipendente <span className={styles.required}>*</span>
          </label>
          <Select
            value={formData.staffId}
            onChange={(e) => updateField('staffId', e.target.value)}
            required
            disabled={!!absence}
          >
            <option value="">Seleziona dipendente...</option>
            {staffList.map((staff) => (
              <option key={staff.id} value={staff.id}>
                {staff.name}
              </option>
            ))}
          </Select>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>
              Data Inizio <span className={styles.required}>*</span>
            </label>
            <Input
              type="date"
              value={formData.startDate}
              onChange={(e) => updateField('startDate', e.target.value)}
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>
              Data Fine <span className={styles.required}>*</span>
            </label>
            <Input
              type="date"
              value={formData.endDate}
              onChange={(e) => updateField('endDate', e.target.value)}
              required
            />
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Tipo Assenza <span className={styles.required}>*</span>
          </label>
          <Select
            value={formData.absenceCode || ''}
            onChange={(e) => updateField('absenceCode', e.target.value as AbsenceCode)}
          >
            <option value="">Seleziona tipo...</option>
            {Object.entries(ABSENCE_CODE_LABELS).map(([code, label]) => (
              <option key={code} value={code}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Ore (Opzionale)
          </label>
          <Input
            type="number"
            value={formData.hoursOptional || ''}
            onChange={(e) => updateField('hoursOptional', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="Per assenze parziali"
            min="0"
            step="0.5"
          />
          <span className={styles.hint}>Lascia vuoto per assenze giornaliere intere</span>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Motivo <span className={styles.required}>*</span>
          </label>
          <textarea
            className={styles.textarea}
            value={formData.reason}
            onChange={(e) => updateField('reason', e.target.value)}
            placeholder="Descrivi il motivo dell'assenza..."
            rows={3}
            required
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Riferimento Documento</label>
          <Input
            value={formData.documentReference || ''}
            onChange={(e) => updateField('documentReference', e.target.value)}
            placeholder="es. Certificato medico #123"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Note Responsabile</label>
          <textarea
            className={styles.textarea}
            value={formData.managerNotes || ''}
            onChange={(e) => updateField('managerNotes', e.target.value)}
            placeholder="Note aggiuntive dal responsabile..."
            rows={2}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="button" onClick={onCancel} variant="ghost" disabled={isSubmitting}>
          Annulla
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Salvataggio...' : absence ? 'Aggiorna' : 'Crea Assenza'}
        </Button>
      </div>
    </form>
  );
};

