'use client';

import React from 'react';
import { Plus, Edit2, Trash2, Check, X, Calendar } from 'react-feather';
import { 
  Button, 
  EmptyState, 
  ErrorState, 
  LoadingState, 
  ConfirmModal,
  DataTable,
  TableFilters,
  Pagination,
  type Column,
  type FilterField,
} from '@/components/dashboard/ui';
import { AbsenceModal } from '../AbsenceModal';
import { ApprovalDialog } from '@/features/smart-shifts/time-bank/components/ApprovalDialog';
import { useAbsencesList } from '../../hooks';
import { ABSENCE_CODE_LABELS, AbsenceCode } from '../../types';
import type { Absence } from '../../types';
import styles from './absences-list.module.css';

interface AbsencesListProps {
  venueId: string;
  staffList: Array<{ id: string; name: string }>;
}

export const AbsencesList: React.FC<AbsencesListProps> = ({ venueId, staffList }) => {
  const {
    filters,
    searchQuery,
    selectedAbsence,
    isModalOpen,
    absenceToDelete,
    absenceToApprove,
    absences,
    isLoading,
    error,
    hasActiveFilters,
    page,
    totalPages,
    limit,
    total,
    setFilters,
    setSearchQuery,
    setPage,
    setLimit,
    handleAdd,
    handleEdit,
    handleDeleteClick,
    confirmDelete,
    handleApproveClick,
    confirmApprove,
    handleRejectClick,
    handleCloseModal,
    clearFilters,
    setAbsenceToDelete,
    setAbsenceToApprove,
  } = useAbsencesList({ venueId });

  // Define table columns
  const columns: Column<Absence>[] = [
    {
      key: 'staffName',
      label: 'Dipendente',
      render: (absence) => (
        <div>
          <div className={styles.staffName}>{absence.staffName || 'N/A'}</div>
          <div className={styles.staffRole}>TEST</div>
        </div>
      ),
    },
    {
      key: 'absenceCode',
      label: 'Tipo',
      render: (absence) => (
        <span className={styles.typeBadge}>
          {ABSENCE_CODE_LABELS[absence.absenceCode as AbsenceCode]}
        </span>
      ),
    },
    {
      key: 'startDate',
      label: 'Data Inizio',
      render: (absence) => new Date(absence.startDate).toLocaleDateString('it-IT'),
    },
    {
      key: 'endDate',
      label: 'Data Fine',
      render: (absence) => new Date(absence.endDate).toLocaleDateString('it-IT'),
    },
    {
      key: 'duration',
      label: 'Giorni',
      align: 'center',
      render: (absence) => (
        <div className={styles.duration}>
          <Calendar size={14} />
          <span>{absence.durationDays} {absence.durationDays === 1 ? 'giorno' : 'giorni'}</span>
        </div>
      ),
    },
    {
      key: 'status',
      label: 'Stato',
      align: 'center',
      render: (absence) => (
        <span className={absence.approved ? styles.statusApproved : styles.statusPending}>
          {absence.approved ? 'Approvata' : 'In attesa'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Azioni',
      align: 'center',
      width: '180px',
      render: (absence) => (
        <div className={styles.actions}>
          {!absence.approved && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleApproveClick(absence);
                }}
                className={styles.actionButton}
                title="Approva"
              >
                <Check size={16} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRejectClick(absence.id);
                }}
                className={styles.actionButton}
                title="Rifiuta"
              >
                <X size={16} />
              </button>
            </>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(absence);
            }}
            className={styles.actionButton}
            title="Modifica"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(absence);
            }}
            className={`${styles.actionButton} ${styles.deleteButton}`}
            title="Elimina"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  // Define filter fields
  const filterFields: FilterField[] = [
    {
      type: 'select',
      label: 'Dipendente',
      value: filters.staffId || '',
      onChange: (value) => setFilters({ ...filters, staffId: value || undefined }),
      options: [
        { value: '', label: 'Tutti' },
        ...staffList.map((staff) => ({ value: staff.id, label: staff.name })),
      ],
    },
    {
      type: 'select',
      label: 'Stato',
      value: filters.approved === undefined ? '' : String(filters.approved),
      onChange: (value) => setFilters({ ...filters, approved: value ? value === 'true' : undefined }),
      options: [
        { value: '', label: 'Tutti' },
        { value: 'true', label: 'Approvate' },
        { value: 'false', label: 'In attesa' },
      ],
    },
    {
      type: 'select',
      label: 'Tipo',
      value: filters.absenceCode || '',
      onChange: (value) => setFilters({ ...filters, absenceCode: value as AbsenceCode || undefined }),
      options: [
        { value: '', label: 'Tutti' },
        ...Object.entries(ABSENCE_CODE_LABELS).map(([code, label]) => ({
          value: code,
          label,
        })),
      ],
    },
  ];

  if (isLoading) {
    return <LoadingState message="Caricamento assenze..." />;
  }

  if (error) {
    return (
      <ErrorState
        message="Errore nel caricamento delle assenze"
        onRetry={() => window.location.reload()}
        retryLabel="Riprova"
      />
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>Gestione Assenze</h2>
          <p className={styles.subtitle}>
            {total} {total === 1 ? 'assenza' : 'assenze'}
            {hasActiveFilters && ' (filtrate)'}
          </p>
        </div>
        <div className={styles.headerRight}>
          <Button onClick={handleAdd} variant="primary">
            <Plus size={18} />
            Nuova Assenza
          </Button>
        </div>
      </div>

      {/* Filters */}
      <TableFilters
        searchField={{
          type: 'search',
          placeholder: 'Cerca per dipendente o motivo...',
          value: searchQuery,
          onChange: setSearchQuery,
          onSearch: () => {}, // Search happens in real-time via onChange
        }}
        filters={filterFields}
        onClearFilters={clearFilters}
        showClearButton={hasActiveFilters}
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={absences}
        keyExtractor={(absence) => absence.id}
        emptyState={
          <EmptyState
            title={hasActiveFilters ? 'Nessuna assenza trovata' : 'Nessuna assenza'}
            description={
              hasActiveFilters
                ? 'Nessuna assenza corrisponde ai filtri selezionati.'
                : 'Non ci sono assenze registrate per questo locale.'
            }
            action={
              hasActiveFilters
                ? {
                    label: 'Cancella Filtri',
                    onClick: clearFilters,
                  }
                : {
                    label: 'Aggiungi Assenza',
                    onClick: handleAdd,
                  }
            }
          />
        }
      />

      {/* Pagination */}
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

      {/* Modals */}
      <AbsenceModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        absence={selectedAbsence}
        venueId={venueId}
        staffList={staffList}
      />

      <ConfirmModal
        isOpen={!!absenceToDelete}
        onClose={() => setAbsenceToDelete(null)}
        onConfirm={confirmDelete}
        title="Elimina Assenza"
        message={`Sei sicuro di voler eliminare l'assenza di ${absenceToDelete?.staffName}?`}
        confirmText="Elimina"
        variant="danger"
      />

      {/* Approval Dialog with Time Bank Integration */}
      {absenceToApprove && (
        <ApprovalDialog
          absence={absenceToApprove}
          isOpen={!!absenceToApprove}
          onApprove={confirmApprove}
          onClose={() => setAbsenceToApprove(null)}
        />
      )}
    </div>
  );
};
