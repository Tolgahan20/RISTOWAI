'use client';

import React from 'react';
import { PageHeader } from '@/components/dashboard/layout';
import { useVenueSelection } from '@/features/smart-shifts/ai-scheduler/hooks/useVenueSelection';
import { VenueSelector as VenueSelectorComponent } from '@/components/dashboard/ui';
import {
  IncidentsList,
  IncidentFormModal,
  ResolveIncidentModal,
} from '@/features/smart-shifts/incidents/components';
import { useIncidentsPage } from '@/features/smart-shifts/incidents/hooks';
import { Plus } from 'react-feather';
import pageLayout from '@/styles/page-layout.module.css';
import styles from './incidents.module.css';

export default function IncidentsPage() {
  const { venues, selectedVenueId, setSelectedVenueId } = useVenueSelection();

  // All page logic is now in the custom hook
  const {
    incidents,
    total,
    page,
    limit,
    isLoading,
    isFormModalOpen,
    isResolveModalOpen,
    selectedIncident,
    isFormLoading,
    isResolveLoading,
    isActionLoading,
    handleCreateNew,
    handleEdit,
    handleFormSubmit,
    handleResolve,
    handleResolveConfirm,
    handleClose,
    handleDelete,
    handlePageChange,
    handleFilterChange,
    handleCloseFormModal,
    handleCloseResolveModal,
  } = useIncidentsPage(selectedVenueId);

  // Show venue selector if no venue is selected
  if (!selectedVenueId) {
    return (
      <VenueSelectorComponent
        venues={venues}
        selectedVenueId={selectedVenueId}
        onVenueChange={setSelectedVenueId}
      />
    );
  }

  return (
    <div className={pageLayout.container}>
      <PageHeader
        title="Gestione Incidenti"
        subtitle="Registra e risolvi incidenti e anomalie"
        showVenueSelector
        venues={venues}
        selectedVenueId={selectedVenueId}
        onVenueChange={setSelectedVenueId}
      />

      <div className={styles.content}>
        <div className={styles.topBar}>
          <button onClick={handleCreateNew} className={styles.createButton}>
            <Plus size={20} />
            Nuovo Incidente
          </button>
        </div>

        {isLoading && (
          <div className={styles.loadingState}>Caricamento incidenti...</div>
        )}

        {!isLoading && incidents.length > 0 && (
          <IncidentsList
            incidents={incidents}
            total={total}
            page={page}
            limit={limit}
            onPageChange={handlePageChange}
            onFilterChange={handleFilterChange}
            onResolve={handleResolve}
            onClose={handleClose}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={isActionLoading}
          />
        )}
      </div>

      {/* Modals */}
      <IncidentFormModal
        isOpen={isFormModalOpen}
        onClose={handleCloseFormModal}
        onSubmit={handleFormSubmit}
        incident={selectedIncident}
        venueId={selectedVenueId}
        isLoading={isFormLoading}
      />

      <ResolveIncidentModal
        isOpen={isResolveModalOpen}
        onClose={handleCloseResolveModal}
        onConfirm={handleResolveConfirm}
        incident={selectedIncident}
        isLoading={isResolveLoading}
      />
    </div>
  );
}

