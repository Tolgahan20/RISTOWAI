'use client';

import React from 'react';
import { Select } from '@/components/dashboard/ui/Select';
import { useRoles } from '../../hooks';
import styles from './role-selector.module.css';

interface RoleSelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  label?: string;
  allowCustom?: boolean;
}

export const RoleSelector: React.FC<RoleSelectorProps> = ({
  value,
  onChange,
  placeholder = 'Seleziona un ruolo',
  required = false,
  error,
  label,
  allowCustom = true,
}) => {
  const { data: roles, isLoading } = useRoles();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.container}>
      {label && (
        <label className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      
      {allowCustom ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          list="roles-datalist"
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          disabled={isLoading}
        />
      ) : (
        <Select
          value={value}
          onChange={handleChange}
          required={required}
          className={error ? styles.selectError : ''}
          disabled={isLoading}
        >
          <option value="" disabled>
            {isLoading ? 'Caricamento...' : placeholder}
          </option>
          {roles?.map((role) => (
            <option key={role.id} value={role.name}>
              {role.name}
              {role.description && ` - ${role.description}`}
            </option>
          ))}
        </Select>
      )}

      {allowCustom && roles && roles.length > 0 && (
        <datalist id="roles-datalist">
          {roles.map((role) => (
            <option key={role.id} value={role.name} />
          ))}
        </datalist>
      )}

      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
};

