import React, { useState } from 'react';
import { Users, UserCheck, Briefcase, FileText, X } from 'react-feather';
import { LoadingState, ErrorState } from '@/components/dashboard/ui';
import { useStaffStats, useStaffByRole, useStaffByContract } from '../../hooks';
import { CONTRACT_TYPE_LABELS } from '../../types';
import styles from './staff-stats.module.css';

interface StaffStatsProps {
  venueId: string;
}

export const StaffStats: React.FC<StaffStatsProps> = ({ venueId }) => {
  const { data: stats, isLoading, isError, refetch } = useStaffStats(venueId);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedContract, setSelectedContract] = useState<string | null>(null);

  const { data: roleStaff, isLoading: roleLoading } = useStaffByRole(
    venueId,
    selectedRole || ''
  );
  const { data: contractStaff, isLoading: contractLoading } = useStaffByContract(
    venueId,
    selectedContract || ''
  );

  if (isLoading) {
    return <LoadingState message="Caricamento statistiche..." />;
  }

  if (isError) {
    return <ErrorState message="Errore nel caricamento delle statistiche" onRetry={refetch} retryLabel="Riprova" />;
  }

  if (!stats) {
    return null;
  }

  // Get sorted roles and contract types
  const roleEntries = Object.entries(stats.byRole).sort((a, b) => b[1] - a[1]);
  const contractEntries = Object.entries(stats.byContractType).sort((a, b) => b[1] - a[1]);

  return (
    <div className={styles.container}>
      {/* Overview Cards */}
      <div className={styles.overviewGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Users size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Totale Dipendenti</div>
            <div className={styles.statValue}>{stats.total}</div>
          </div>
        </div>

        <div className={`${styles.statCard} ${styles.activeCard}`}>
          <div className={styles.statIcon}>
            <UserCheck size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Dipendenti Attivi</div>
            <div className={styles.statValue}>{stats.active}</div>
            <div className={styles.statSubtext}>
              {stats.total > 0 ? Math.round((stats.active / stats.total) * 100) : 0}% del totale
            </div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <Briefcase size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Ruoli Distinti</div>
            <div className={styles.statValue}>{roleEntries.length}</div>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <FileText size={24} />
          </div>
          <div className={styles.statContent}>
            <div className={styles.statLabel}>Tipi di Contratto</div>
            <div className={styles.statValue}>{contractEntries.length}</div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className={styles.detailsGrid}>
        {/* By Role */}
        <div className={styles.detailCard}>
          <h3 className={styles.detailTitle}>Distribuzione per Ruolo</h3>
          <div className={styles.detailList}>
            {roleEntries.length > 0 ? (
              roleEntries.map(([role, count]) => (
                <div 
                  key={role} 
                  className={`${styles.detailItem} ${styles.clickable}`}
                  onClick={() => setSelectedRole(role)}
                >
                  <div className={styles.detailInfo}>
                    <span className={styles.detailLabel}>{role}</span>
                    <span className={styles.detailCount}>{count} {count === 1 ? 'dipendente' : 'dipendenti'}</span>
                  </div>
                  <div className={styles.detailBar}>
                    <div
                      className={styles.detailBarFill}
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyMessage}>Nessun ruolo disponibile</div>
            )}
          </div>
        </div>

        {/* By Contract Type */}
        <div className={styles.detailCard}>
          <h3 className={styles.detailTitle}>Distribuzione per Contratto</h3>
          <div className={styles.detailList}>
            {contractEntries.length > 0 ? (
              contractEntries.map(([type, count]) => (
                <div 
                  key={type} 
                  className={`${styles.detailItem} ${styles.clickable}`}
                  onClick={() => setSelectedContract(type)}
                >
                  <div className={styles.detailInfo}>
                    <span className={styles.detailLabel}>
                      {CONTRACT_TYPE_LABELS[type as keyof typeof CONTRACT_TYPE_LABELS] || type}
                    </span>
                    <span className={styles.detailCount}>{count} {count === 1 ? 'dipendente' : 'dipendenti'}</span>
                  </div>
                  <div className={styles.detailBar}>
                    <div
                      className={styles.detailBarFill}
                      style={{ width: `${(count / stats.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className={styles.emptyMessage}>Nessun tipo di contratto disponibile</div>
            )}
          </div>
        </div>
      </div>

      {/* Role Filter Modal */}
      {selectedRole && (
        <div className={styles.modal} onClick={() => setSelectedRole(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Staff: {selectedRole}</h3>
              <button onClick={() => setSelectedRole(null)} className={styles.closeButton}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              {roleLoading ? (
                <LoadingState message="Caricamento..." />
              ) : roleStaff && roleStaff.length > 0 ? (
                <div className={styles.staffList}>
                  {roleStaff.map((staff) => (
                    <div key={staff.id} className={styles.staffItem}>
                      <div className={styles.staffItemInfo}>
                        <div className={styles.staffItemName}>
                          {staff.firstName} {staff.lastName}
                        </div>
                        <div className={styles.staffItemDetails}>
                          {staff.contractType} • {staff.weeklyHours}h/settimana
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyMessage}>Nessuno staff trovato</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Contract Filter Modal */}
      {selectedContract && (
        <div className={styles.modal} onClick={() => setSelectedContract(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Staff: {CONTRACT_TYPE_LABELS[selectedContract as keyof typeof CONTRACT_TYPE_LABELS] || selectedContract}</h3>
              <button onClick={() => setSelectedContract(null)} className={styles.closeButton}>
                <X size={20} />
              </button>
            </div>
            <div className={styles.modalBody}>
              {contractLoading ? (
                <LoadingState message="Caricamento..." />
              ) : contractStaff && contractStaff.length > 0 ? (
                <div className={styles.staffList}>
                  {contractStaff.map((staff) => (
                    <div key={staff.id} className={styles.staffItem}>
                      <div className={styles.staffItemInfo}>
                        <div className={styles.staffItemName}>
                          {staff.firstName} {staff.lastName}
                        </div>
                        <div className={styles.staffItemDetails}>
                          {staff.staffRole} • {staff.weeklyHours}h/settimana
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.emptyMessage}>Nessuno staff trovato</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

