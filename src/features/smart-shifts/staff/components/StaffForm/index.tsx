import React, { useState } from 'react';
import { X } from 'react-feather';
import { Button } from '@/components/dashboard/ui/Button';
import { Input } from '@/components/dashboard/ui/Input';
import { Select } from '@/components/dashboard/ui/Select';
import { RoleSelector } from '@/features/smart-shifts/roles/components';
import { useStaffForm } from '../../hooks/useStaffForm';
import { CONTRACT_TYPE_LABELS, COMMON_SKILLS, ContractType } from '../../types';
import type { Staff } from '../../types';
import styles from './staff-form.module.css';

interface StaffFormProps {
  venueId: string;
  staff?: Staff;
  onSuccess: () => void;
  onCancel: () => void;
}

export const StaffForm: React.FC<StaffFormProps> = ({ venueId, staff, onSuccess, onCancel }) => {
  const { formData, updateField, addSkill, removeSkill, handleSubmit, isLoading, isEditMode } =
    useStaffForm(venueId, staff);
  const [newSkill, setNewSkill] = useState('');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit();
    onSuccess();
  };

  const handleAddSkill = () => {
    if (newSkill.trim()) {
      addSkill(newSkill.trim());
      setNewSkill('');
    }
  };

  return (
    <form onSubmit={onSubmit} className={styles.form}>
      {/* Personal Information */}
      {!isEditMode && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Informazioni Personali</h3>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>Nome</label>
              <Input
                type="text"
                value={formData.firstName || ''}
                onChange={(e) => updateField('firstName', e.target.value)}
                placeholder="Marco"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Cognome</label>
              <Input
                type="text"
                value={formData.lastName || ''}
                onChange={(e) => updateField('lastName', e.target.value)}
                placeholder="Rossi"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <Input
                type="email"
                value={formData.email || ''}
                onChange={(e) => updateField('email', e.target.value)}
                placeholder="marco.rossi@example.com"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Telefono</label>
              <Input
                type="tel"
                value={formData.phone || ''}
                onChange={(e) => updateField('phone', e.target.value)}
                placeholder="+39 320 1234567"
              />
            </div>
          </div>
        </div>
      )}

      {/* Personal Information Note */}
      {isEditMode && staff && (
        <div className={styles.infoNote}>
          <p className={styles.infoText}>
            <strong>Dipendente:</strong> {staff.firstName} {staff.lastName}
            {staff.email && ` • ${staff.email}`}
          </p>
          <p className={styles.infoHelp}>
            Le informazioni personali (nome, email, telefono) sono gestite dall&apos;account utente associato
          </p>
        </div>
      )}

      {/* Fiscal Information */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Informazioni Fiscali</h3>
        <div className={styles.grid}>
          <div className={styles.field}>
            <label className={styles.label}>Codice Fiscale</label>
            <Input
              type="text"
              value={formData.codiceFiscale || ''}
              onChange={(e) => updateField('codiceFiscale', e.target.value.toUpperCase())}
              placeholder="RSSMRA80A01H501X"
              maxLength={16}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Data di Nascita</label>
            <Input
              type="date"
              value={formData.birthDate || ''}
              onChange={(e) => updateField('birthDate', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Contract Information */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Informazioni Contrattuali</h3>
        <div className={styles.grid}>
          <div className={styles.field}>
            <RoleSelector
              value={formData.staffRole || ''}
              onChange={(value) => updateField('staffRole', value)}
              label="Ruolo"
              placeholder="Seleziona o scrivi un ruolo"
              required={true}
              allowCustom={true}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Tipo Contratto <span className={styles.required}>*</span>
            </label>
            <Select
              value={formData.contractType || ''}
              onChange={(e) => updateField('contractType', e.target.value as ContractType)}
              required
            >
              {Object.entries(CONTRACT_TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Ore Settimanali <span className={styles.required}>*</span>
            </label>
            <Input
              type="number"
              value={formData.weeklyHours || ''}
              onChange={(e) => updateField('weeklyHours', parseInt(e.target.value))}
              min="1"
              max="48"
              required
              placeholder="40"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Tariffa Oraria (€) <span className={styles.required}>*</span>
            </label>
            <Input
              type="number"
              value={formData.hourlyRate || ''}
              onChange={(e) => updateField('hourlyRate', parseFloat(e.target.value))}
              min="0"
              step="0.01"
              required
              placeholder="12.50"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Livello CCNL</label>
            <Input
              type="text"
              value={formData.ccnlLevel || ''}
              onChange={(e) => updateField('ccnlLevel', e.target.value)}
              placeholder="es. 3° livello"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>IBAN</label>
            <Input
              type="text"
              value={formData.iban || ''}
              onChange={(e) => updateField('iban', e.target.value.toUpperCase())}
              placeholder="IT60 X054 2811 1010 0000 0123 456"
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Data Assunzione <span className={styles.required}>*</span>
            </label>
            <Input
              type="date"
              value={formData.hireDate || ''}
              onChange={(e) => updateField('hireDate', e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Data Fine Contratto</label>
            <Input
              type="date"
              value={formData.endDate || ''}
              onChange={(e) => updateField('endDate', e.target.value)}
            />
            <span className={styles.fieldHelp}>Lascia vuoto per contratto indeterminato</span>
          </div>
        </div>
      </div>

      {/* Skills */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Competenze</h3>
        <div className={styles.skillsContainer}>
          <div className={styles.skillsInputRow}>
            <Select
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              className={styles.skillSelect}
            >
              <option value="">Seleziona competenza</option>
              {COMMON_SKILLS.filter((skill) => !formData.skills?.includes(skill)).map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </Select>
            <Button type="button" onClick={handleAddSkill} variant="secondary" disabled={!newSkill}>
              Aggiungi
            </Button>
          </div>

          {formData.skills && formData.skills.length > 0 && (
            <div className={styles.skillsList}>
              {formData.skills.map((skill) => (
                <div key={skill} className={styles.skillTag}>
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className={styles.skillRemove}
                    aria-label="Rimuovi competenza"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Form Actions */}
      <div className={styles.actions}>
        <Button type="button" onClick={onCancel} variant="ghost" disabled={isLoading}>
          Annulla
        </Button>
        <Button type="submit" variant="primary" disabled={isLoading}>
          {isLoading ? 'Salvataggio...' : isEditMode ? 'Aggiorna' : 'Crea Dipendente'}
        </Button>
      </div>
    </form>
  );
};

