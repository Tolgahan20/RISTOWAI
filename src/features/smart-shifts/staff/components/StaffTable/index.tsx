import React, { useState } from 'react';
import { Edit2, Trash2, Calendar, UserPlus, Link, Check } from 'react-feather';
import { 
  Button, 
  LoadingState, 
  ErrorState, 
  EmptyState, 
  ConfirmModal,
  DataTable,
  TableFilters,
  Pagination,
  type Column,
  type FilterField,
} from '@/components/dashboard/ui';
import { useStaffTable } from '../../hooks';
import { CONTRACT_TYPE_LABELS, COMMON_STAFF_ROLES } from '../../types';
import { STAFF_MESSAGES } from '../../../common/constants/messages';
import type { Staff } from '../../types';
import styles from './staff-table.module.css';

interface StaffTableProps {
  venueId: string;
  onEdit: (staff: Staff) => void;
  onAdd: () => void;
}

export const StaffTable: React.FC<StaffTableProps> = ({ venueId, onEdit, onAdd }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const {
    page,
    pageSize,
    filters,
    searchInput,
    deleteModalOpen,
    data,
    isLoading,
    isError,
    isDeleting,
    hasFilters,
    setPage,
    setPageSize,
    setSearchInput,
    setDeleteModalOpen,
    handleFilterChange,
    handleClearFilters,
    handleDeleteClick,
    handleConfirmDelete,
    handleViewSchedule,
    refetch,
    getFullName,
    isActive,
  } = useStaffTable({ venueId });

  const handleCopyMagicLink = (staff: Staff) => {
    if (!staff.personalToken) {
      alert('Token non disponibile per questo dipendente');
      return;
    }

    const link = `${window.location.origin}/s/${staff.personalToken}/schedule`;
    navigator.clipboard.writeText(link).then(() => {
      setCopiedId(staff.id);
      setTimeout(() => setCopiedId(null), 2000);
    }).catch(() => {
      alert('Errore nella copia del link');
    });
  };

  // Define table columns
  const columns: Column<Staff>[] = [
    {
      key: 'name',
      label: 'Nome',
      render: (staff) => (
        <div className={styles.nameWrapper}>
          <span className={styles.name}>{getFullName(staff)}</span>
          {staff.email && <span className={styles.email}>{staff.email}</span>}
        </div>
      ),
    },
    {
      key: 'staffRole',
      label: 'Ruolo',
      render: (staff) => staff.staffRole,
    },
    {
      key: 'contractType',
      label: 'Contratto',
      render: (staff) => (
        <span className={styles.badge}>{CONTRACT_TYPE_LABELS[staff.contractType]}</span>
      ),
    },
    {
      key: 'weeklyHours',
      label: 'Ore/Sett.',
      render: (staff) => `${staff.weeklyHours}h`,
    },
    {
      key: 'hourlyRate',
      label: 'Tariffa',
      render: (staff) => `€${staff.hourlyRate}/h`,
    },
    {
      key: 'hireDate',
      label: 'Assunzione',
      render: (staff) => new Date(staff.hireDate).toLocaleDateString('it-IT'),
    },
    {
      key: 'status',
      label: 'Stato',
      render: (staff) => (
        <span className={`${styles.statusBadge} ${isActive(staff) ? styles.active : styles.inactive}`}>
          {isActive(staff) ? 'Attivo' : 'Inattivo'}
        </span>
      ),
    },
    {
      key: 'preferences',
      label: 'Preferenze',
      render: (staff) => {
        if (!staff.availability) {
          return <span className={styles.noPreferences}>-</span>;
        }

        const hasSpecificDaysOff = staff.availability.specificDaysOff?.length && staff.availability.specificDaysOff.length > 0;
        const hasPreferredShifts = Object.keys(staff.availability).some((key) => {
          if (key === 'specificDaysOff' || key === 'preferences') return false;
          const dayData = staff.availability?.[key as keyof typeof staff.availability];
          return (
            dayData && 
            typeof dayData === 'object' && 
            'preferredShift' in dayData &&
            dayData.preferredShift !== 'any'
          );
        });
        
        if (!hasSpecificDaysOff && !hasPreferredShifts) {
          return <span className={styles.noPreferences}>-</span>;
        }
        
        return (
          <span className={styles.hasPreferences} title="Ha preferenze impostate">
            ✓ Impostate
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: 'Azioni',
      align: 'center',
      width: '180px',
      render: (staff) => (
        <div className={styles.actions}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCopyMagicLink(staff);
            }}
            className={`${styles.actionButton} ${copiedId === staff.id ? styles.copiedButton : ''}`}
            title={copiedId === staff.id ? "Link Copiato!" : "Copia Link Personale"}
          >
            {copiedId === staff.id ? <Check size={16} /> : <Link size={16} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewSchedule(staff.id);
            }}
            className={styles.actionButton}
            title="Visualizza Turni"
          >
            <Calendar size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(staff);
            }}
            className={styles.actionButton}
            title="Modifica"
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(staff.id);
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
      label: 'Ruolo',
      value: filters.role || '',
      onChange: (value) => handleFilterChange('role', value),
      options: [
        { value: '', label: 'Tutti i ruoli' },
        ...COMMON_STAFF_ROLES.map((role) => ({ value: role, label: role })),
      ],
    },
    {
      type: 'select',
      label: 'Tipo Contratto',
      value: filters.contractType || '',
      onChange: (value) => handleFilterChange('contractType', value),
      options: [
        { value: '', label: 'Tutti i contratti' },
        ...Object.entries(CONTRACT_TYPE_LABELS).map(([value, label]) => ({
          value,
          label,
        })),
      ],
    },
    {
      type: 'custom',
      value: '',
      onChange: () => {},
      customRender: () => (
        <div className={styles.checkboxWrapper}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              checked={filters.activeOnly || false}
              onChange={(e) => handleFilterChange('activeOnly', e.target.checked)}
              className={styles.checkbox}
            />
            Solo attivi
          </label>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <LoadingState message="Caricamento staff..." />;
  }

  if (isError) {
    return <ErrorState message={STAFF_MESSAGES.load.error} onRetry={refetch} retryLabel="Riprova" />;
  }

  if (!data || data.total === 0) {
    return (
      <>
        <EmptyState
          icon={<UserPlus size={56} strokeWidth={1.5} />}
          title={hasFilters ? 'Nessun risultato trovato' : 'Nessun dipendente trovato'}
          description={
            hasFilters
              ? 'Non ci sono dipendenti che corrispondono ai filtri di ricerca. Prova a modificare i criteri di ricerca o cancella i filtri.'
              : 'Non hai ancora aggiunto dipendenti a questo locale. Inizia creando il primo profilo del personale.'
          }
          action={{
            label: hasFilters ? 'Cancella filtri' : '+ Aggiungi il tuo primo dipendente',
            onClick: hasFilters ? handleClearFilters : onAdd,
          }}
        />
        <ConfirmModal
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          title="Elimina Dipendente"
          message={STAFF_MESSAGES.delete.confirm}
          confirmText="Elimina"
          variant="danger"
          isLoading={isDeleting}
        />
      </>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h2 className={styles.title}>Dipendenti</h2>
          <p className={styles.subtitle}>
            {data.total} {data.total === 1 ? 'dipendente' : 'dipendenti'}
          </p>
        </div>
        <Button onClick={onAdd} variant="primary">
          + Aggiungi Dipendente
        </Button>
      </div>

      {/* Search and Filters */}
      <TableFilters
        searchField={{
          type: 'search',
          placeholder: 'Cerca per nome, email o ruolo...',
          value: searchInput,
          onChange: setSearchInput,
          onSearch: () => handleFilterChange('search', searchInput),
        }}
        filters={filterFields}
        onClearFilters={handleClearFilters}
        showClearButton={!!hasFilters}
      />

      {/* Table */}
      <DataTable
        columns={columns}
        data={data.data}
        keyExtractor={(staff) => staff.id}
      />

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={data.totalPages}
        pageSize={pageSize}
        totalItems={data.total}
        onPageChange={setPage}
        onPageSizeChange={(size) => {
          setPageSize(size);
          setPage(1);
        }}
      />

      {/* Delete Modal */}
      <ConfirmModal
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Elimina Dipendente"
        message={STAFF_MESSAGES.delete.confirm}
        confirmText="Elimina"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};
