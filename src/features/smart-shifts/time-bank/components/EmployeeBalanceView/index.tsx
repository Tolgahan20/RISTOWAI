'use client';

import React, { useState } from 'react';
import { Calendar, TrendingUp, Clock, AlertCircle, RefreshCw } from 'react-feather';
import { useEmployeeBalance, useManualAdjustments, useRecalculateBalance } from '../../hooks/useTimeBank';
import { LoadingState, ErrorState } from '@/components/dashboard/ui';
import { formatDate } from '@/features/smart-shifts/common/utils/dateHelpers';
import styles from './employee-balance-view.module.css';

interface EmployeeBalanceViewProps {
  staffId: string;
  staffName: string;
  year?: number;
}

export const EmployeeBalanceView: React.FC<EmployeeBalanceViewProps> = ({
  staffId,
  staffName,
  year,
}) => {
  const currentYear = year || new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const { data: balance, isLoading, error, refetch } = useEmployeeBalance(staffId, selectedYear);
  const { data: adjustments = [] } = useManualAdjustments(staffId);
  const recalculateMutation = useRecalculateBalance();

  const handleRecalculate = async () => {
    try {
      await recalculateMutation.mutateAsync({ staffId, year: selectedYear });
      refetch();
    } catch (error) {
      console.error('Failed to recalculate balance:', error);
    }
  };

  if (isLoading) {
    return <LoadingState message="Caricamento saldo..." />;
  }

  if (error) {
    return <ErrorState message="Errore nel caricamento del saldo" />;
  }

  if (!balance) {
    return (
      <div className={styles.emptyState}>
        <AlertCircle size={48} />
        <p>Nessun dato disponibile per questo dipendente</p>
      </div>
    );
  }

  const hasVacationWarning =
    (balance.projYeVacationH ?? 0) < 0 ||
    (balance.carryoverCapVacationHours && (balance.projYeVacationH ?? 0) > balance.carryoverCapVacationHours);

  const hasRolWarning =
    (balance.projYeRolH ?? 0) < 0 ||
    (balance.carryoverCapRolHours && (balance.projYeRolH ?? 0) > balance.carryoverCapRolHours);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>Banca Ore - {staffName}</h2>
          <p className={styles.subtitle}>Saldi e proiezioni (solo visivi)</p>
        </div>
        <div className={styles.headerRight}>
          <select
            className={styles.yearSelect}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            <option value={currentYear - 1}>{currentYear - 1}</option>
            <option value={currentYear}>{currentYear}</option>
            <option value={currentYear + 1}>{currentYear + 1}</option>
          </select>
          <button
            className={styles.recalculateButton}
            onClick={handleRecalculate}
            disabled={recalculateMutation.isPending}
          >
            <RefreshCw size={16} />
            Ricalcola
          </button>
        </div>
      </div>

      {/* Balance Cards */}
      <div className={styles.balanceCards}>
        {/* Vacation Card */}
        <div className={styles.balanceCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#DBEAFE' }}>
              <Calendar size={24} color="#1E40AF" />
            </div>
            <h3 className={styles.cardTitle}>Ferie</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.mainBalance}>
              <span className={styles.balanceValue}>{(balance.vacationBalanceH ?? 0).toFixed(1)}</span>
              <span className={styles.balanceUnit}>ore</span>
            </div>
            <div className={styles.balanceDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Maturate:</span>
                <span className={styles.detailValue}>{(balance.vacationAccruedH ?? 0).toFixed(1)} h</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Fruite:</span>
                <span className={styles.detailValue}>{(balance.vacationTakenH ?? 0).toFixed(1)} h</span>
              </div>
            </div>
            <div className={styles.projection}>
              <TrendingUp size={14} />
              <span>Proiezione 31 Dic: {(balance.projYeVacationH ?? 0).toFixed(1)} h</span>
            </div>
            {hasVacationWarning && (
              <div className={styles.warning}>
                <AlertCircle size={14} />
                <span>
                  {balance.projYeVacationH < 0
                    ? 'Proiezione negativa'
                    : `Supera limite (${balance.carryoverCapVacationHours} h)`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ROL Card */}
        <div className={styles.balanceCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#FEF3C7' }}>
              <Clock size={24} color="#92400E" />
            </div>
            <h3 className={styles.cardTitle}>ROL</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.mainBalance}>
              <span className={styles.balanceValue}>{(balance.rolBalanceH ?? 0).toFixed(1)}</span>
              <span className={styles.balanceUnit}>ore</span>
            </div>
            <div className={styles.balanceDetails}>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Maturate:</span>
                <span className={styles.detailValue}>{(balance.rolAccruedH ?? 0).toFixed(1)} h</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailLabel}>Fruite:</span>
                <span className={styles.detailValue}>{(balance.rolTakenH ?? 0).toFixed(1)} h</span>
              </div>
            </div>
            <div className={styles.projection}>
              <TrendingUp size={14} />
              <span>Proiezione 31 Dic: {(balance.projYeRolH ?? 0).toFixed(1)} h</span>
            </div>
            {hasRolWarning && (
              <div className={styles.warning}>
                <AlertCircle size={14} />
                <span>
                  {balance.projYeRolH < 0
                    ? 'Proiezione negativa'
                    : `Supera limite (${balance.carryoverCapRolHours} h)`}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Bank Hours Card */}
        <div className={styles.balanceCard}>
          <div className={styles.cardHeader}>
            <div className={styles.cardIcon} style={{ backgroundColor: '#D1FAE5' }}>
              <TrendingUp size={24} color="#065F46" />
            </div>
            <h3 className={styles.cardTitle}>Banca Ore</h3>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.mainBalance}>
              <span className={styles.balanceValue}>{(balance.bankBalanceH ?? 0).toFixed(1)}</span>
              <span className={styles.balanceUnit}>ore</span>
            </div>
            <p className={styles.bankNote}>
              Calcolato automaticamente dalle timbrature (ore lavorate - ore programmate) + aggiustamenti manuali.
            </p>
          </div>
        </div>
      </div>

      {/* Movements Table */}
      <div className={styles.movementsSection}>
        <div className={styles.movementsHeader}>
          <h3 className={styles.movementsTitle}>Movimenti Visuali</h3>
          <span className={styles.movementsCount}>{adjustments.length} movimenti</span>
        </div>
        
        {adjustments.length === 0 ? (
          <div className={styles.emptyMovements}>
            <p>Nessun movimento manuale registrato</p>
          </div>
        ) : (
          <div className={styles.movementsTable}>
            <div className={styles.tableHeader}>
              <div className={styles.tableCell}>Data</div>
              <div className={styles.tableCell}>Tipo</div>
              <div className={styles.tableCell}>Ore</div>
              <div className={styles.tableCell}>Motivo</div>
              <div className={styles.tableCell}>Registrato da</div>
            </div>
            {adjustments.map((adjustment) => (
              <div key={adjustment.id} className={styles.tableRow}>
                <div className={styles.tableCell}>
                  {formatDate(adjustment.createdAt)}
                </div>
                <div className={styles.tableCell}>
                  <span className={`${styles.typeBadge} ${styles[`type${adjustment.bucket}`]}`}>
                    {adjustment.bucket === 'VACATION' ? 'Ferie' : adjustment.bucket === 'ROL' ? 'ROL' : 'Banca'}
                  </span>
                </div>
                <div className={styles.tableCell}>
                  <span className={adjustment.hours >= 0 ? styles.positive : styles.negative}>
                    {adjustment.hours >= 0 ? '+' : ''}{adjustment.hours.toFixed(1)} h
                  </span>
                </div>
                <div className={styles.tableCell}>
                  {adjustment.reason || '-'}
                </div>
                <div className={styles.tableCell}>
                  {adjustment.adjustedBy}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className={styles.disclaimer}>
        <AlertCircle size={16} />
        <p>
          Questi dati sono puramente informativi e non hanno valore legale o contabile.
          La riconciliazione formale sarà disponibile in una versione futura.
        </p>
      </div>
    </div>
  );
};

