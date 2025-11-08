'use client';

import React from 'react';
import { Incident, IncidentType, IncidentSeverity, CreateIncidentRequest } from '../../types';
import { getIncidentTypeLabel, getIncidentSeverityLabel } from '../../utils/incidentHelpers';
import { useIncidentForm } from '../../hooks/useIncidentForm';
import { useStaff } from '@/features/smart-shifts/staff/hooks/useStaff';
import { useVenueShifts } from '../../hooks/useVenueShifts';
import { X, AlertTriangle } from 'react-feather';
import styles from './incident-form-modal.module.css';

interface IncidentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateIncidentRequest) => void;
  incident?: Incident | null;
  venueId: string;
  isLoading?: boolean;
}

export const IncidentFormModal: React.FC<IncidentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  incident,
  venueId,
  isLoading = false,
}) => {
  const { formData, errors, updateField, handleSubmit } = useIncidentForm({
    venueId,
    incident,
    onSubmit,
  });

  // Fetch staff list
  const { data: staffData } = useStaff(venueId, 1, 1000);
  const staffList = staffData?.data || [];

  // Fetch available shifts
  const { data: shiftsList, isLoading: shiftsLoading } = useVenueShifts(venueId);

  const handleClose = () => {
    if (!isLoading) {
      onClose();
    }
  };

  // Helper to get display name for staff
  const getStaffDisplayName = (staff: typeof staffList[0]) => {
    const name = staff.firstName && staff.lastName 
      ? `${staff.firstName} ${staff.lastName}`
      : staff.venueMemberId;
    return `${name} - ${staff.staffRole}`;
  };

  // Helper to get display name for shifts
  const getShiftDisplayName = (shift: typeof shiftsList[0]) => {
    const date = new Date(shift.startTime).toLocaleDateString('it-IT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
    const startTime = new Date(shift.startTime).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
    const endTime = new Date(shift.endTime).toLocaleTimeString('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
    });
    return `${date} | ${startTime}-${endTime} | ${shift.staffName}${shift.phaseName ? ` | ${shift.phaseName}` : ''}`;
  };

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <AlertTriangle size={24} />
            <h2 className={styles.title}>
              {incident ? 'Modifica Incidente' : 'Nuovo Incidente'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className={styles.closeButton}
            disabled={isLoading}
            aria-label="Chiudi"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="staffId" className={styles.label}>
                Dipendente <span className={styles.required}>*</span>
              </label>
              <select
                id="staffId"
                value={formData.staffId}
                onChange={(e) => updateField('staffId', e.target.value)}
                className={`${styles.select} ${errors.staffId ? styles.inputError : ''}`}
                disabled={isLoading || !!incident}
                required
              >
                <option value="">Seleziona dipendente...</option>
                {staffList.map((staff) => (
                  <option key={staff.id} value={staff.id}>
                    {getStaffDisplayName(staff)}
                  </option>
                ))}
              </select>
              {errors.staffId && <span className={styles.errorText}>{errors.staffId}</span>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="shiftId" className={styles.label}>
                Turno
              </label>
              <select
                id="shiftId"
                value={formData.shiftId || ''}
                onChange={(e) => updateField('shiftId', e.target.value)}
                className={styles.select}
                disabled={isLoading || shiftsLoading}
              >
                <option value="">
                  {shiftsLoading 
                    ? 'Caricamento turni...' 
                    : shiftsList && shiftsList.length > 0
                      ? 'Nessun turno (opzionale)'
                      : 'Nessun turno disponibile - Crea un programma prima'}
                </option>
                {shiftsList && shiftsList.length > 0 && (
                  shiftsList.map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {getShiftDisplayName(shift)}
                    </option>
                  ))
                )}
              </select>
              <span className={styles.hint}>
                {shiftsList && shiftsList.length > 0 
                  ? 'Seleziona il turno coinvolto nell\'incidente' 
                  : 'Genera un programma turni per selezionare turni specifici'}
              </span>
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="incidentDate" className={styles.label}>
                Data Incidente <span className={styles.required}>*</span>
              </label>
              <input
                id="incidentDate"
                type="date"
                value={formData.incidentDate}
                onChange={(e) => updateField('incidentDate', e.target.value)}
                className={`${styles.input} ${errors.incidentDate ? styles.inputError : ''}`}
                disabled={isLoading}
              />
              {errors.incidentDate && (
                <span className={styles.errorText}>{errors.incidentDate}</span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reportedBy" className={styles.label}>
                Segnalato Da
              </label>
              <input
                id="reportedBy"
                type="text"
                value={formData.reportedBy || ''}
                onChange={(e) => updateField('reportedBy', e.target.value)}
                className={styles.input}
                placeholder="Nome del segnalante..."
                disabled={isLoading}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label htmlFor="incidentType" className={styles.label}>
                Tipo Incidente <span className={styles.required}>*</span>
              </label>
              <select
                id="incidentType"
                value={formData.incidentType}
                onChange={(e) => updateField('incidentType', e.target.value)}
                className={styles.select}
                disabled={isLoading}
              >
                {Object.values(IncidentType).map((type) => (
                  <option key={type} value={type}>
                    {getIncidentTypeLabel(type)}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="severity" className={styles.label}>
                Severità <span className={styles.required}>*</span>
              </label>
              <select
                id="severity"
                value={formData.severity}
                onChange={(e) => updateField('severity', e.target.value)}
                className={styles.select}
                disabled={isLoading}
              >
                {Object.values(IncidentSeverity).map((severity) => (
                  <option key={severity} value={severity}>
                    {getIncidentSeverityLabel(severity)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.label}>
              Descrizione <span className={styles.required}>*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => updateField('description', e.target.value)}
              className={`${styles.textarea} ${errors.description ? styles.inputError : ''}`}
              placeholder="Descrivi l'incidente in dettaglio..."
              rows={4}
              disabled={isLoading}
            />
            {errors.description && (
              <span className={styles.errorText}>{errors.description}</span>
            )}
          </div>

          <div className={styles.actions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              Annulla
            </button>
            <button type="submit" className={styles.submitButton} disabled={isLoading}>
              {isLoading
                ? 'Salvataggio...'
                : incident
                  ? 'Aggiorna'
                  : 'Crea Incidente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

