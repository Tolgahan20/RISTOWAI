'use client';

import React, { useState } from 'react';
import { Users, UserCheck, UserX, AlertCircle, Calendar, ChevronDown, ChevronUp, CheckSquare, Square } from 'react-feather';
import { Button, LoadingState } from '@/components/dashboard/ui';
import { useStaffAvailability } from '../../../hooks/useStaffAvailability';
import styles from './staff-availability-step.module.css';

interface StaffAvailabilityStepProps {
  venueId: string;
  dateRange: { startDate: string; endDate: string };
  selectedStaffIds: string[];
  onUpdate: (staffIds: string[]) => void;
}

export const StaffAvailabilityStep: React.FC<StaffAvailabilityStepProps> = ({
  venueId,
  dateRange,
  selectedStaffIds,
  onUpdate,
}) => {
  const [expandedStaffId, setExpandedStaffId] = useState<string | null>(null);

  const { data: availability, isLoading, error } = useStaffAvailability(
    {
      venueId,
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    },
    true,
  );

  if (isLoading) {
    return <LoadingState message="Controllo disponibilità dipendenti..." />;
  }

  if (error || !availability) {
    return (
      <div className={styles.errorContainer}>
        <AlertCircle size={48} />
        <p>Errore nel caricamento della disponibilità</p>
      </div>
    );
  }

  const { staff, totalStaff, availableCount, unavailableCount } = availability;

  // Selection handlers
  const handleToggleStaff = (staffId: string) => {
    if (selectedStaffIds.includes(staffId)) {
      onUpdate(selectedStaffIds.filter((id) => id !== staffId));
    } else {
      onUpdate([...selectedStaffIds, staffId]);
    }
  };

  const handleSelectAll = () => {
    onUpdate(staff.map((s) => s.staffId));
  };

  const handleSelectAvailable = () => {
    onUpdate(staff.filter((s) => s.isAvailable).map((s) => s.staffId));
  };

  const handleDeselectAll = () => {
    onUpdate([]);
  };

  const isStaffSelected = (staffId: string) => selectedStaffIds.includes(staffId);
  const selectedCount = selectedStaffIds.length;
  const selectedAvailableCount = selectedStaffIds.filter((id) =>
    staff.find((s) => s.staffId === id && s.isAvailable),
  ).length;
  const allSelected = selectedCount === totalStaff;

  const toggleExpand = (staffId: string) => {
    setExpandedStaffId(expandedStaffId === staffId ? null : staffId);
  };

  return (
    <div className={styles.container}>
      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <Users size={32} />
          <div className={styles.summaryContent}>
            <div className={styles.summaryValue}>{selectedCount} / {totalStaff}</div>
            <div className={styles.summaryLabel}>Dipendenti Selezionati</div>
          </div>
        </div>

        <div className={`${styles.summaryCard} ${styles.available}`}>
          <UserCheck size={32} />
          <div className={styles.summaryContent}>
            <div className={styles.summaryValue}>{selectedAvailableCount}</div>
            <div className={styles.summaryLabel}>Disponibili Selezionati</div>
          </div>
        </div>

        <div className={`${styles.summaryCard} ${styles.unavailable}`}>
          <UserX size={32} />
          <div className={styles.summaryContent}>
            <div className={styles.summaryValue}>{unavailableCount}</div>
            <div className={styles.summaryLabel}>Non Disponibili</div>
          </div>
        </div>
      </div>

      {/* Warning if too few staff */}
      {selectedAvailableCount === 0 && selectedCount > 0 && (
        <div className={styles.warningBanner}>
          <AlertCircle size={20} />
          <div>
            <strong>Attenzione:</strong> Nessun dipendente disponibile selezionato.
            La generazione dei turni fallirà se non selezioni almeno un dipendente disponibile.
          </div>
        </div>
      )}

      {unavailableCount > availableCount && (
        <div className={styles.warningBanner}>
          <AlertCircle size={20} />
          <div>
            <strong>Attenzione:</strong> Ci sono più dipendenti non disponibili che disponibili.
            La generazione dei turni potrebbe non riuscire a coprire tutte le fasi.
          </div>
        </div>
      )}

      {/* Staff Table */}
      <div className={styles.staffTable}>
        <div className={styles.tableHeader}>
          <h3 className={styles.tableTitle}>
            <Users size={18} />
            Seleziona Dipendenti
          </h3>
          <div className={styles.tableActions}>
            <Button
              variant="ghost"
              onClick={allSelected ? handleDeselectAll : handleSelectAll}
              size="small"
            >
              {allSelected ? 'Deseleziona Tutti' : 'Seleziona Tutti'}
            </Button>
            <Button
              variant="ghost"
              onClick={handleSelectAvailable}
              size="small"
            >
              Solo Disponibili
            </Button>
          </div>
        </div>

        <div className={styles.table}>
          {/* Available Staff */}
          {staff.filter((s) => s.isAvailable).length > 0 && (
            <>
              <div className={styles.sectionTitle}>Disponibili ({availableCount})</div>
              {staff
                .filter((s) => s.isAvailable)
                .map((member) => (
                  <div
                    key={member.staffId}
                    className={`${styles.staffRow} ${isStaffSelected(member.staffId) ? styles.selected : ''}`}
                    onClick={() => handleToggleStaff(member.staffId)}
                  >
                    <div className={styles.checkbox}>
                      {isStaffSelected(member.staffId) ? (
                        <CheckSquare size={20} className={styles.checkedIcon} />
                      ) : (
                        <Square size={20} className={styles.uncheckedIcon} />
                      )}
                    </div>
                    <div className={styles.statusIndicator}>
                      <UserCheck size={20} className={styles.availableIcon} />
                    </div>
                    <div className={styles.staffInfo}>
                      <div className={styles.staffName}>{member.name}</div>
                      <div className={styles.staffMeta}>
                        {member.role} • {member.weeklyHours}h/settimana
                      </div>
                    </div>
                    <div className={styles.statusBadge}>
                      <span className={styles.availableBadge}>Disponibile</span>
                    </div>
                  </div>
                ))}
            </>
          )}

          {/* Unavailable Staff */}
          {unavailableCount > 0 && (
            <>
              <div className={styles.sectionTitle}>Non Disponibili ({unavailableCount})</div>
              {staff
                .filter((s) => !s.isAvailable)
                .map((member) => (
                  <div key={member.staffId}>
                    <div
                      className={`${styles.staffRow} ${styles.unavailableRow} ${isStaffSelected(member.staffId) ? styles.selected : ''}`}
                    >
                      <div className={styles.checkbox} onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStaff(member.staffId);
                      }}>
                        {isStaffSelected(member.staffId) ? (
                          <CheckSquare size={20} className={styles.checkedIcon} />
                        ) : (
                          <Square size={20} className={styles.uncheckedIcon} />
                        )}
                      </div>
                      <div className={styles.statusIndicator}>
                        <UserX size={20} className={styles.unavailableIcon} />
                      </div>
                      <div 
                        className={styles.staffInfo}
                        onClick={() => toggleExpand(member.staffId)}
                        style={{ flex: 1, cursor: 'pointer' }}
                      >
                        <div className={styles.staffName}>{member.name}</div>
                        <div className={styles.staffMeta}>
                          {member.role} • {member.weeklyHours}h/settimana
                        </div>
                        <div className={styles.unavailabilityReason}>
                          {member.unavailabilityReason}
                        </div>
                      </div>
                      <div 
                        className={styles.expandButton}
                        onClick={() => toggleExpand(member.staffId)}
                      >
                        {expandedStaffId === member.staffId ? (
                          <ChevronUp size={20} />
                        ) : (
                          <ChevronDown size={20} />
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedStaffId === member.staffId && member.absences && (
                      <div className={styles.absenceDetails}>
                        <div className={styles.absenceTitle}>
                          <Calendar size={16} />
                          Periodi di Assenza
                        </div>
                        {member.absences.map((absence, idx) => (
                          <div key={idx} className={styles.absencePeriod}>
                            <div className={styles.absenceDates}>
                              {new Date(absence.startDate).toLocaleDateString('it-IT')} -{' '}
                              {new Date(absence.endDate).toLocaleDateString('it-IT')}
                            </div>
                            <div className={styles.absenceType}>
                              {absence.absenceCode}
                              {absence.reason && ` - ${absence.reason}`}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
            </>
          )}
        </div>
      </div>

      {/* Info Box */}
      <div className={styles.infoBox}>
        <AlertCircle size={18} />
        <p>
          <strong>Suggerimento:</strong> Seleziona solo i dipendenti disponibili per garantire
          che la generazione dei turni abbia successo. I dipendenti non disponibili sono mostrati
          per riferimento ma non dovrebbero essere selezionati.
        </p>
      </div>
    </div>
  );
};
