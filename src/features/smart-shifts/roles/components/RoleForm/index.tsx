'use client';

import React from 'react';
import { Button } from '@/components/dashboard/ui/Button';
import { Input } from '@/components/dashboard/ui/Input';
import { useRoleForm } from '../../hooks';
import type { Role } from '../../types';
import styles from './role-form.module.css';

interface RoleFormProps {
  role?: Role;
  onSuccess: () => void;
  onCancel: () => void;
}

export const RoleForm: React.FC<RoleFormProps> = ({ role, onSuccess, onCancel }) => {
  const { formData, updateField, handleSubmit, isSubmitting } = useRoleForm(role);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
    onSuccess();
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>
          Nome Ruolo <span className={styles.required}>*</span>
        </label>
        <Input
          value={formData.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="es. Sommelier, Pizzaiolo"
          required
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Descrizione</label>
        <textarea
          className={styles.textarea}
          value={formData.description}
          onChange={(e) => updateField('description', e.target.value)}
          placeholder="Descrizione breve del ruolo..."
          rows={3}
        />
      </div>

      <div className={styles.actions}>
        <Button type="button" onClick={onCancel} variant="ghost" disabled={isSubmitting}>
          Annulla
        </Button>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? 'Salvataggio...' : role ? 'Aggiorna' : 'Crea Ruolo'}
        </Button>
      </div>
    </form>
  );
};

