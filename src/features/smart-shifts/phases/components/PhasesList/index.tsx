'use client';

import React from 'react';
import { Plus, Filter, BarChart } from 'react-feather';
import { Button } from '@/components/dashboard/ui/Button';
import { Select } from '@/components/dashboard/ui/Select';
import { LoadingState, ErrorState, EmptyState } from '@/components/dashboard/ui';
import { Pagination } from '@/components/dashboard/ui/Pagination';
import { PhaseCard } from '../PhaseCard';
import { PhaseModal } from '../PhaseModal';
import { ConfirmModal } from '@/components/dashboard/ui/ConfirmModal';
import { usePhasesList } from '../../hooks';
import { PHASE_TYPE_LABELS, DAYS_OF_WEEK } from '../../types';
import styles from './phases-list.module.css';

interface PhasesListProps {
  venueId: string;
}

export const PhasesList: React.FC<PhasesListProps> = ({ venueId }) => {
  const {
    phases,
    total,
    page,
    totalPages,
    limit,
    isLoading,
    error,
    refetch,
    selectedPhase,
    isModalOpen,
    phaseToDelete,
    showFilters,
    showStats,
    filterType,
    filterDay,
    filterActive,
    hasActiveFilters,
    handleAdd,
    handleEdit,
    handleDeleteClick,
    confirmDelete,
    handleCloseModal,
    clearFilters,
    toggleFilters,
    toggleStats,
    setPage,
    setLimit,
    setFilterType,
    setFilterDay,
    setFilterActive,
    setPhaseToDelete,
  } = usePhasesList(venueId);

  if (isLoading) {
    return <LoadingState message="Caricamento fasi..." />;
  }

  if (error) {
    return (
      <ErrorState
        message="Errore nel caricamento delle fasi"
        onRetry={refetch}
        retryLabel="Riprova"
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>Gestione Fasi</h2>
          <p className={styles.subtitle}>
            {phases.length} {phases.length === 1 ? 'fase' : 'fasi'}
          </p>
        </div>
        <div className={styles.headerRight}>
          <Button onClick={toggleStats} variant="ghost">
            <BarChart size={18} />
            {showStats ? 'Nascondi' : 'Statistiche'}
          </Button>
          <Button onClick={toggleFilters} variant="ghost">
            <Filter size={18} />
            Filtri
          </Button>
          <Button onClick={handleAdd} variant="primary">
            <Plus size={18} />
            Nuova Fase
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className={styles.filtersPanel}>
          <div className={styles.filtersGrid}>
            <div className={styles.filterField}>
              <label className={styles.filterLabel}>Tipo</label>
              <Select value={filterType || ''} onChange={(e) => setFilterType(e.target.value)}>
                <option value="">Tutti</option>
                {Object.entries(PHASE_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </div>

            <div className={styles.filterField}>
              <label className={styles.filterLabel}>Giorno</label>
              <Select value={filterDay !== undefined ? String(filterDay) : ''} onChange={(e) => setFilterDay(e.target.value)}>
                <option value="">Tutti</option>
                {DAYS_OF_WEEK.map((day) => (
                  <option key={day.value} value={day.value}>{day.label}</option>
                ))}
              </Select>
            </div>

            <div className={styles.filterField}>
              <label className={styles.filterLabel}>Stato</label>
              <Select value={filterActive !== undefined ? String(filterActive) : ''} onChange={(e) => setFilterActive(e.target.value)}>
                <option value="">Tutti</option>
                <option value="true">Attive</option>
                <option value="false">Non attive</option>
              </Select>
            </div>
          </div>

          {hasActiveFilters && (
            <Button onClick={clearFilters} variant="ghost">
              Cancella Filtri
            </Button>
          )}
        </div>
      )}

      {phases.length === 0 ? (
        <EmptyState
          title={hasActiveFilters ? 'Nessuna fase trovata' : 'Nessuna fase configurata'}
          description={
            hasActiveFilters
              ? 'Prova a modificare i filtri per vedere più risultati.'
              : 'Crea la prima fase per il tuo locale. Le fasi definiscono i diversi momenti operativi (preparazione, pranzo, cena, ecc.).'
          }
          action={{
            label: hasActiveFilters ? 'Cancella Filtri' : 'Crea Prima Fase',
            onClick: hasActiveFilters ? clearFilters : handleAdd,
          }}
        />
      ) : (
        <>
          <div className={styles.grid}>
            {phases.map((phase) => (
              <PhaseCard
                key={phase.id}
                phase={phase}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>

          {total > 0 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              pageSize={limit}
              totalItems={total}
              onPageChange={setPage}
              onPageSizeChange={(size) => {
                setLimit(size);
                setPage(1);
              }}
            />
          )}
        </>
      )}

      <PhaseModal
        venueId={venueId}
        phase={selectedPhase}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <ConfirmModal
        isOpen={!!phaseToDelete}
        onClose={() => setPhaseToDelete(null)}
        onConfirm={confirmDelete}
        title="Elimina Fase"
        message={`Sei sicuro di voler eliminare la fase "${phaseToDelete?.name}"? Questa azione non può essere annullata.`}
        variant="danger"
        confirmText="Elimina"
        cancelText="Annulla"
      />
    </div>
  );
};
