'use client';

import React from 'react';
import { Plus, Edit2, Trash2, Lock } from 'react-feather';
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
import { RoleModal } from '../RoleModal';
import { useRolesList } from '../../hooks';
import type { Role } from '../../types';
import styles from './roles-list.module.css';

export const RolesList: React.FC = () => {
  const {
    selectedRole,
    isModalOpen,
    roleToDelete,
    searchQuery,
    filterType,
    roles,
    allRoles,
    total,
    page,
    totalPages,
    limit,
    isLoading,
    error,
    hasActiveFilters,
    systemRolesCount,
    customRolesCount,
    setSearchQuery,
    setFilterType,
    setPage,
    setLimit,
    handleAdd,
    handleEdit,
    handleDeleteClick,
    confirmDelete,
    handleCloseModal,
    clearFilters,
    setRoleToDelete,
  } = useRolesList();

  // Define table columns
  const columns: Column<Role>[] = [
    {
      key: 'name',
      label: 'Nome',
      render: (role) => (
        <div className={styles.nameCell}>
          {role.name}
          {role.isSystem && (
            <span className={styles.systemBadge}>
              <Lock size={12} />
              Sistema
            </span>
          )}
        </div>
      ),
    },
    {
      key: 'description',
      label: 'Descrizione',
      render: (role) => (
        <span className={styles.descriptionCell}>
          {role.description || '-'}
        </span>
      ),
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (role) => (
        <span className={role.isSystem ? styles.typeSystem : styles.typeCustom}>
          {role.isSystem ? 'Predefinito' : 'Personalizzato'}
        </span>
      ),
    },
    {
      key: 'status',
      label: 'Stato',
      render: (role) => (
        <span className={role.isActive ? styles.statusActive : styles.statusInactive}>
          {role.isActive ? 'Attivo' : 'Inattivo'}
        </span>
      ),
    },
    {
      key: 'actions',
      label: 'Azioni',
      align: 'center',
      width: '120px',
      render: (role) => (
        <div className={styles.actions}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(role);
            }}
            className={styles.editButton}
            title={role.isSystem ? 'I ruoli di sistema non possono essere modificati' : 'Modifica'}
            disabled={role.isSystem}
          >
            <Edit2 size={16} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick(role);
            }}
            className={styles.deleteButton}
            title={role.isSystem ? 'I ruoli di sistema non possono essere eliminati' : 'Elimina'}
            disabled={role.isSystem}
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
      label: 'Tipo',
      value: filterType,
      onChange: setFilterType,
      options: [
        { value: 'all', label: `Tutti (${allRoles?.length || 0})` },
        { value: 'system', label: `Predefiniti (${systemRolesCount})` },
        { value: 'custom', label: `Personalizzati (${customRolesCount})` },
      ],
    },
  ];

  if (isLoading) {
    return <LoadingState message="Caricamento ruoli..." />;
  }

  if (error) {
    return (
      <ErrorState
        message="Errore nel caricamento dei ruoli"
        onRetry={() => window.location.reload()}
        retryLabel="Riprova"
      />
    );
  }

  return (
    <div className={styles.container}>
      {/* Header Actions */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <p className={styles.subtitle}>
            {roles.length} {roles.length === 1 ? 'ruolo' : 'ruoli'}
            {hasActiveFilters && ' (filtrati)'}
          </p>
        </div>
        <div className={styles.headerRight}>
          <Button onClick={handleAdd} variant="primary">
            <Plus size={18} />
            Nuovo Ruolo
          </Button>
        </div>
      </div>

      {/* Filters */}
      <TableFilters
        searchField={{
          type: 'search',
          placeholder: 'Cerca ruolo per nome o descrizione...',
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
        data={roles}
        keyExtractor={(role) => role.id}
        emptyState={
          <EmptyState
            title={hasActiveFilters ? 'Nessun ruolo trovato' : 'Nessun ruolo disponibile'}
            description={
              hasActiveFilters
                ? 'Prova a modificare i filtri o la ricerca per vedere più risultati.'
                : 'Crea il primo ruolo personalizzato per il tuo ristorante.'
            }
            action={{
              label: hasActiveFilters ? 'Cancella Filtri' : 'Crea Primo Ruolo',
              onClick: hasActiveFilters ? clearFilters : handleAdd,
            }}
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
      <RoleModal
        role={selectedRole}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />

      <ConfirmModal
        isOpen={!!roleToDelete}
        onClose={() => setRoleToDelete(null)}
        onConfirm={confirmDelete}
        title="Elimina Ruolo"
        message={`Sei sicuro di voler eliminare il ruolo "${roleToDelete?.name}"? Questa azione non può essere annullata.`}
        variant="danger"
        confirmText="Elimina"
        cancelText="Annulla"
      />
    </div>
  );
};
