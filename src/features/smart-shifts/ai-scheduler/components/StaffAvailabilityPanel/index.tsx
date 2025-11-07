'use client';

import React from 'react';
import { Users, UserCheck, UserX, AlertCircle, Calendar } from 'react-feather';
import { LoadingState } from '@/components/dashboard/ui';
import type { AvailabilityResponse } from '../../types/availability';
import styles from './staff-availability-panel.module.css';

interface StaffAvailabilityPanelProps {
  availability: AvailabilityResponse | undefined;
  isLoading: boolean;
  error: Error | null;
}

export const StaffAvailabilityPanel: React.FC<StaffAvailabilityPanelProps> = ({
  availability,
  isLoading,
  error,
}) => {
  if (isLoading) {
    return (
      <div className={styles.container}>
        <LoadingState message="Controllo disponibilità..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.errorBox}>
          <AlertCircle size={20} />
          <span>Errore nel caricamento della disponibilità</span>
        </div>
      </div>
    );
  }

  if (!availability) {
    return null;
  }

  const { staff, totalStaff, availableCount, unavailableCount } = availability;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Users size={20} />
          Disponibilità Dipendenti
        </h3>
      </div>

      {/* Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <Users size={24} />
          </div>
          <div className={styles.summaryContent}>
            <div className={styles.summaryLabel}>Totale</div>
            <div className={styles.summaryValue}>{totalStaff}</div>
          </div>
        </div>

        <div className={`${styles.summaryCard} ${styles.available}`}>
          <div className={styles.summaryIcon}>
            <UserCheck size={24} />
          </div>
          <div className={styles.summaryContent}>
            <div className={styles.summaryLabel}>Disponibili</div>
            <div className={styles.summaryValue}>{availableCount}</div>
          </div>
        </div>

        <div className={`${styles.summaryCard} ${styles.unavailable}`}>
          <div className={styles.summaryIcon}>
            <UserX size={24} />
          </div>
          <div className={styles.summaryContent}>
            <div className={styles.summaryLabel}>Non Disponibili</div>
            <div className={styles.summaryValue}>{unavailableCount}</div>
          </div>
        </div>
      </div>

      {/* Staff List */}
      {unavailableCount > 0 && (
        <div className={styles.unavailableSection}>
          <div className={styles.sectionTitle}>
            <AlertCircle size={18} />
            Dipendenti Non Disponibili ({unavailableCount})
          </div>
          <div className={styles.staffList}>
            {staff
              .filter((s) => !s.isAvailable)
              .map((member) => (
                <div key={member.staffId} className={styles.staffCard}>
                  <div className={styles.staffInfo}>
                    <div className={styles.staffName}>{member.name}</div>
                    <div className={styles.staffRole}>{member.role}</div>
                  </div>
                  <div className={styles.unavailabilityReason}>
                    {member.unavailabilityReason}
                  </div>
                  {member.absences && member.absences.length > 0 && (
                    <div className={styles.absenceDetails}>
                      {member.absences.map((absence, idx) => (
                        <div key={idx} className={styles.absencePeriod}>
                          <Calendar size={14} />
                          <span>
                            {new Date(absence.startDate).toLocaleDateString('it-IT')} -{' '}
                            {new Date(absence.endDate).toLocaleDateString('it-IT')}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

