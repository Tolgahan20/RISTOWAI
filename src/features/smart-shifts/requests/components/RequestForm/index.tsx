'use client';

import React from 'react';
import { Button } from '@/components/dashboard/ui/Button';
import { Input } from '@/components/dashboard/ui/Input';
import { Select } from '@/components/dashboard/ui/Select';
import { useRequestForm } from '../../hooks';
import { RequestType, RequestPriority } from '../../types';
import type { Request } from '../../types';
import styles from './request-form.module.css';

interface RequestFormProps {
  venueId: string;
  request?: Request;
  staffList: Array<{ id: string; name: string }>;
  onSuccess: () => void;
  onCancel: () => void;
}

const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  [RequestType.TIME_OFF]: 'Permesso',
  [RequestType.SHIFT_SWAP]: 'Scambio Turno',
  [RequestType.SCHEDULE_CHANGE]: 'Modifica Orario',
  [RequestType.EXTRA_SHIFT]: 'Turno Extra',
  [RequestType.EARLY_LEAVE]: 'Uscita Anticipata',
  [RequestType.LATE_ARRIVAL]: 'Entrata Posticipata',
};

const PRIORITY_LABELS: Record<RequestPriority, string> = {
  [RequestPriority.LOW]: 'Bassa',
  [RequestPriority.NORMAL]: 'Normale',
  [RequestPriority.HIGH]: 'Alta',
  [RequestPriority.URGENT]: 'Urgente',
};

export const RequestForm: React.FC<RequestFormProps> = ({
  venueId,
  request,
  staffList,
  onSuccess,
  onCancel,
}) => {
  const { formData, setFormData, handleSubmit, isLoading } = useRequestForm({
    venueId,
    request,
    onSuccess,
  });

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit();
  };

  const needsShift = formData.type === RequestType.SHIFT_SWAP;
  const needsSwapStaff = formData.type === RequestType.SHIFT_SWAP;

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
            disabled={!!request}
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
              Tipo Richiesta <span className={styles.required}>*</span>
            </label>
            <Select
              value={formData.type}
              onChange={(e) => updateField('type', e.target.value)}
              required
            >
              {Object.entries(REQUEST_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Priorità</label>
            <Select
              value={formData.priority}
              onChange={(e) => updateField('priority', e.target.value)}
            >
              {Object.entries(PRIORITY_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>
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
      </div>

      {(needsShift || needsSwapStaff) && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Dettagli Scambio</h3>

          {needsSwapStaff && (
            <div className={styles.field}>
              <label className={styles.label}>
                Scambia con {needsShift && <span className={styles.required}>*</span>}
              </label>
              <Select
                value={formData.swapWithStaffId || ''}
                onChange={(e) => updateField('swapWithStaffId', e.target.value)}
                required={needsShift}
              >
                <option value="">Seleziona dipendente...</option>
                {staffList
                  .filter((staff) => staff.id !== formData.staffId)
                  .map((staff) => (
                    <option key={staff.id} value={staff.id}>
                      {staff.name}
                    </option>
                  ))}
              </Select>
            </div>
          )}

          {needsShift && (
            <div className={styles.field}>
              <label className={styles.label}>
                ID Turno <span className={styles.required}>*</span>
              </label>
              <Input
                type="text"
                value={formData.targetShiftId || ''}
                onChange={(e) => updateField('targetShiftId', e.target.value)}
                placeholder="Inserisci l'ID del turno"
                required={needsShift}
              />
              <span className={styles.hint}>
                L'ID del turno da scambiare (visibile nel calendario)
              </span>
            </div>
          )}
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Dettagli Aggiuntivi</h3>

        <div className={styles.field}>
          <label className={styles.label}>Motivo</label>
          <Input
            type="text"
            value={formData.reason || ''}
            onChange={(e) => updateField('reason', e.target.value)}
            placeholder="Motivo della richiesta"
          />
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Note</label>
          <textarea
            className={styles.textarea}
            value={formData.notes || ''}
            onChange={(e) => updateField('notes', e.target.value)}
            placeholder="Note aggiuntive..."
            rows={3}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Annulla
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Salvataggio...' : request ? 'Aggiorna' : 'Crea'}
        </Button>
      </div>
    </form>
  );
};

