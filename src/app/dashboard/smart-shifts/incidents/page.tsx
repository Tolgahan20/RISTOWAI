'use client';

import React, { useState } from 'react';
import { PageHeader } from '@/components/dashboard/layout';
import { useVenueSelection } from '@/features/smart-shifts/ai-scheduler/hooks/useVenueSelection';
import { VenueSelector as VenueSelectorComponent } from '@/components/dashboard/ui';
import {
  IncidentsList,
  IncidentFormModal,
  ResolveIncidentModal,
} from '@/features/smart-shifts/incidents/components';
import {
  useIncidents,
  useCreateIncident,
  useUpdateIncident,
  useResolveIncident,
  useCloseIncident,
  useDeleteIncident,
} from '@/features/smart-shifts/incidents/hooks/useIncidents';
import { Incident, CreateIncidentRequest, PaginatedIncidentsQuery } from '@/features/smart-shifts/incidents/types';
import { INCIDENT_MESSAGES } from '@/features/smart-shifts/common/constants/messages';
import { Plus } from 'react-feather';
import pageLayout from '@/styles/page-layout.module.css';
import styles from './incidents.module.css';

export default function IncidentsPage() {
  const { venues, selectedVenueId, setSelectedVenueId } = useVenueSelection();

  const [filters, setFilters] = useState<PaginatedIncidentsQuery>({
    page: 1,
    limit: 10,
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Fetch incidents with filters - merge venueId with filters
  const { data, isLoading } = useIncidents({
    ...filters,
    venueId: selectedVenueId || '',
  });

  // Mutations
  const createMutation = useCreateIncident();
  const updateMutation = useUpdateIncident();
  const resolveMutation = useResolveIncident();
  const closeMutation = useCloseIncident();
  const deleteMutation = useDeleteIncident();

  // Handlers
  const handleCreateNew = () => {
    setSelectedIncident(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = (data: CreateIncidentRequest) => {
    if (selectedIncident) {
      updateMutation.mutate(
        { id: selectedIncident.id, data },
        {
          onSuccess: () => {
            setIsFormModalOpen(false);
            setSelectedIncident(null);
          },
        }
      );
    } else {
      createMutation.mutate(data, {
        onSuccess: () => {
          setIsFormModalOpen(false);
        },
      });
    }
  };

  const handleResolve = (incident: Incident) => {
    setSelectedIncident(incident);
    setIsResolveModalOpen(true);
  };

  const handleResolveConfirm = (
    resolutionNotes: string,
    actionTaken?: string,
    resolvedBy?: string
  ) => {
    if (!selectedIncident) return;

    resolveMutation.mutate(
      {
        id: selectedIncident.id,
        data: { resolutionNotes, actionTaken, resolvedBy },
      },
      {
        onSuccess: () => {
          setIsResolveModalOpen(false);
          setSelectedIncident(null);
        },
      }
    );
  };

  const handleClose = (incident: Incident) => {
    if (window.confirm('Sei sicuro di voler chiudere questo incidente?')) {
      closeMutation.mutate(incident.id);
    }
  };

  const handleDelete = (incident: Incident) => {
    if (window.confirm(INCIDENT_MESSAGES.delete.confirm)) {
      deleteMutation.mutate(incident.id);
    }
  };

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const handleFilterChange = (newFilters: Partial<PaginatedIncidentsQuery>) => {
    setFilters((prev) => ({ ...prev, ...newFilters, page: 1 }));
  };

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

        {!isLoading && data && (
          <IncidentsList
            incidents={data.data}
            total={data.total}
            page={data.page}
            limit={data.limit}
            onPageChange={handlePageChange}
            onFilterChange={handleFilterChange}
            onResolve={handleResolve}
            onClose={handleClose}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isLoading={
              resolveMutation.isPending ||
              closeMutation.isPending ||
              deleteMutation.isPending
            }
          />
        )}
      </div>

      {/* Modals */}
      <IncidentFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedIncident(null);
        }}
        onSubmit={handleFormSubmit}
        incident={selectedIncident}
        venueId={selectedVenueId}
        isLoading={createMutation.isPending || updateMutation.isPending}
      />

      <ResolveIncidentModal
        isOpen={isResolveModalOpen}
        onClose={() => {
          setIsResolveModalOpen(false);
          setSelectedIncident(null);
        }}
        onConfirm={handleResolveConfirm}
        incident={selectedIncident}
        isLoading={resolveMutation.isPending}
      />
    </div>
  );
}

