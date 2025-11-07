'use client';

import React from 'react';
import { Plus, Trash2 } from 'react-feather';
import { Button } from '@/components/dashboard/ui/Button';
import { Input } from '@/components/dashboard/ui/Input';
import { Select } from '@/components/dashboard/ui/Select';
import { RoleSelector } from '@/features/smart-shifts/roles/components';
import { usePhaseForm } from '../../hooks';
import { PHASE_TYPE_LABELS, DAYS_OF_WEEK, COMMON_PHASE_NAMES, PhaseType } from '../../types';
import type { Phase } from '../../types';
import styles from './phase-form.module.css';

interface PhaseFormProps {
  venueId: string;
  phase?: Phase;
  onSuccess: () => void;
  onCancel: () => void;
}

export const PhaseForm: React.FC<PhaseFormProps> = ({ venueId, phase, onSuccess, onCancel }) => {
  const { formData, updateField, handleSubmit, isSubmitting } = usePhaseForm(venueId, phase);

  const onSubmit = async () => {
    await handleSubmit();
    onSuccess();
  };

  const addRoleRequirement = () => {
    updateField('roleRequirements', [
      ...formData.roleRequirements,
      { role: '', minStaff: 1, maxStaff: undefined },
    ]);
  };

  const removeRoleRequirement = (index: number) => {
    updateField(
      'roleRequirements',
      formData.roleRequirements.filter((_, i) => i !== index)
    );
  };

  const updateRoleRequirement = (index: number, field: string, value: unknown) => {
    const updated = [...formData.roleRequirements];
    updated[index] = { ...updated[index], [field]: value };
    updateField('roleRequirements', updated);
  };

  const toggleDay = (day: number) => {
    const days = formData.daysOfWeek || [];
    if (days.includes(day)) {
      updateField('daysOfWeek', days.filter((d) => d !== day));
    } else {
      updateField('daysOfWeek', [...days, day].sort());
    }
  };

  return (
    <div className={styles.form}>
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Informazioni Base</h3>
        
        <div className={styles.field}>
          <label className={styles.label}>Nome Fase</label>
          <Select
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
          >
            <option value="">Seleziona o scrivi...</option>
            {COMMON_PHASE_NAMES.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </Select>
          <Input
            placeholder="O inserisci un nome personalizzato"
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
          />
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Ora Inizio</label>
            <Input
              type="time"
              value={formData.startTime}
              onChange={(e) => updateField('startTime', e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Ora Fine</label>
            <Input
              type="time"
              value={formData.endTime}
              onChange={(e) => updateField('endTime', e.target.value)}
            />
          </div>
        </div>

        <div className={styles.row}>
          <div className={styles.field}>
            <label className={styles.label}>Tipo</label>
            <Select
              value={formData.type}
              onChange={(e) => updateField('type', e.target.value as PhaseType)}
            >
              {Object.entries(PHASE_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </Select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Priorità</label>
            <Input
              type="number"
              value={formData.priority}
              onChange={(e) => updateField('priority', parseInt(e.target.value))}
              min="0"
            />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Giorni Attivi</h3>
        <div className={styles.daysGrid}>
          {DAYS_OF_WEEK.map((day) => (
            <button
              key={day.value}
              type="button"
              className={`${styles.dayButton} ${
                (formData.daysOfWeek || []).includes(day.value) ? styles.dayActive : ''
              }`}
              onClick={() => toggleDay(day.value)}
            >
              {day.short}
            </button>
          ))}
        </div>
        <p className={styles.hint}>Lascia vuoto per applicare a tutti i giorni</p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Requisiti Ruoli</h3>
          <Button onClick={addRoleRequirement} variant="ghost">
            <Plus size={16} />
            Aggiungi Ruolo
          </Button>
        </div>
        <div className={styles.requirements}>
          {formData.roleRequirements.map((req, index) => (
            <div key={index} className={styles.requirement}>
              <RoleSelector
                value={req.role}
                onChange={(value) => updateRoleRequirement(index, 'role', value)}
                placeholder="Seleziona o scrivi un ruolo"
                allowCustom={true}
              />
              <Input
                type="number"
                placeholder="Min"
                value={req.minStaff}
                onChange={(e) => updateRoleRequirement(index, 'minStaff', parseInt(e.target.value))}
                min="0"
              />
              <Input
                type="number"
                placeholder="Max (opzionale)"
                value={req.maxStaff || ''}
                onChange={(e) => updateRoleRequirement(index, 'maxStaff', e.target.value ? parseInt(e.target.value) : undefined)}
                min="0"
              />
              <button
                type="button"
                onClick={() => removeRoleRequirement(index)}
                className={styles.removeButton}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Note</h3>
        <textarea
          className={styles.textarea}
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          placeholder="Note aggiuntive..."
          rows={3}
        />
      </div>

      <div className={styles.actions}>
        <Button onClick={onCancel} variant="ghost" disabled={isSubmitting}>
          Annulla
        </Button>
        <Button onClick={onSubmit} variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Salvataggio...' : phase ? 'Aggiorna' : 'Crea Fase'}
        </Button>
      </div>
    </div>
  );
};

