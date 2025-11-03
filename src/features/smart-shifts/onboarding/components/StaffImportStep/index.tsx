'use client';

import { Input, Select, Button } from '@/components/dashboard/ui';
import type { ContractType, StaffImportData } from '../../types';
import { useStaffImportStep } from '../../hooks/useStaffImportStep';
import styles from './staff-import-step.module.css';

interface StaffImportStepProps {
  onSave: (data: StaffImportData) => Promise<void>;
  isSaving: boolean;
  initialData?: StaffImportData | null;
}

export function StaffImportStep({ onSave, isSaving, initialData }: StaffImportStepProps) {
  const {
    staff,
    editingMember,
    setEditingMember,
    handleAddMember,
    handleRemoveMember,
    handleSubmit,
    handleSkip,
  } = useStaffImportStep({ onSave, initialData });

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Aggiungi Staff</h1>
        <p className={styles.description}>
          Aggiungi i membri del tuo team (puoi farlo anche dopo)
        </p>

        {/* Add Member Form */}
        <div className={styles.addSection}>
          <h3 className={styles.sectionTitle}>Dati Personali</h3>
          <div className={styles.formGrid}>
            <Input
              type="text"
              placeholder="Nome *"
              value={editingMember.firstName || ''}
              onChange={(e) => setEditingMember({ ...editingMember, firstName: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Cognome *"
              value={editingMember.lastName || ''}
              onChange={(e) => setEditingMember({ ...editingMember, lastName: e.target.value })}
            />
            <Input
              type="text"
              placeholder="Codice Fiscale"
              value={editingMember.codiceFiscale || ''}
              onChange={(e) => setEditingMember({ ...editingMember, codiceFiscale: e.target.value.toUpperCase() })}
              maxLength={16}
            />
            <Input
              type="date"
              placeholder="Data di nascita"
              value={editingMember.birthDate || ''}
              onChange={(e) => setEditingMember({ ...editingMember, birthDate: e.target.value })}
            />
            <Input
              type="email"
              placeholder="Email"
              value={editingMember.email || ''}
              onChange={(e) => setEditingMember({ ...editingMember, email: e.target.value })}
            />
            <Input
              type="tel"
              placeholder="Telefono"
              value={editingMember.phone || ''}
              onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
            />
          </div>

          <h3 className={styles.sectionTitle}>Contratto</h3>
          <div className={styles.formGrid}>
            <Select
              value={editingMember.role || ''}
              onChange={(e) => setEditingMember({ ...editingMember, role: e.target.value })}
            >
              <option value="">Ruolo *</option>
              <option value="CAMERIERE">Cameriere</option>
              <option value="CUOCO">Cuoco</option>
              <option value="BARISTA">Barista</option>
              <option value="MANAGER">Manager</option>
              <option value="ALTRO">Altro</option>
            </Select>
            <Select
              value={editingMember.contractType || 'FULL_TIME'}
              onChange={(e) => setEditingMember({ ...editingMember, contractType: e.target.value as ContractType })}
            >
              <option value="FULL_TIME">Full Time</option>
              <option value="PART_TIME">Part Time</option>
              <option value="SEASONAL">Stagionale</option>
            </Select>
            <Input
              type="number"
              placeholder="Ore settimanali"
              value={editingMember.weeklyContractHours || ''}
              onChange={(e) => setEditingMember({ ...editingMember, weeklyContractHours: Number(e.target.value) })}
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Tariffa oraria (€)"
              value={editingMember.hourlyRate || ''}
              onChange={(e) => setEditingMember({ ...editingMember, hourlyRate: Number(e.target.value) })}
            />
            <Input
              type="text"
              placeholder="Livello CCNL (es. 4°)"
              value={editingMember.ccnlLevel || ''}
              onChange={(e) => setEditingMember({ ...editingMember, ccnlLevel: e.target.value })}
            />
            <Input
              type="text"
              placeholder="IBAN"
              value={editingMember.iban || ''}
              onChange={(e) => setEditingMember({ ...editingMember, iban: e.target.value.toUpperCase() })}
              maxLength={27}
            />
          </div>
          <button
            type="button"
            onClick={handleAddMember}
            className={styles.addButton}
            disabled={!editingMember.firstName || !editingMember.lastName || !editingMember.role}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Aggiungi
          </button>
        </div>

        {/* Staff List */}
        {staff.length > 0 && (
          <div className={styles.staffList}>
            <p className={styles.staffLabel}>Staff aggiunto ({staff.length}):</p>
            <div className={styles.staffGrid}>
              {staff.map((member, index) => (
                <div key={index} className={styles.memberCard}>
                  <div className={styles.memberInfo}>
                    <h3 className={styles.memberName}>
                      {member.firstName} {member.lastName}
                    </h3>
                    <p className={styles.memberRole}>{member.role}</p>
                    {member.email && <p className={styles.memberDetail}>{member.email}</p>}
                    <div className={styles.memberMeta}>
                      <span>{member.contractType}</span>
                      <span>{member.weeklyContractHours}h/week</span>
                      <span>€{member.hourlyRate}/h</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMember(index)}
                    className={styles.removeButton}
                  >
                    Rimuovi
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
            disabled={isSaving || staff.length === 0}
            fullWidth
          >
            {isSaving ? 'Salvataggio...' : `Continua con ${staff.length} membri`}
          </Button>
        </form>
      </div>
    </div>
  );
}

