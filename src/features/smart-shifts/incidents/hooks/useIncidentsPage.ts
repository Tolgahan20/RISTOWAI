import { useState } from 'react';
import {
  useIncidents,
  useCreateIncident,
  useUpdateIncident,
  useResolveIncident,
  useCloseIncident,
  useDeleteIncident,
} from './useIncidents';
import { INCIDENT_MESSAGES } from '@/features/smart-shifts/common/constants/messages';
import type {
  Incident,
  CreateIncidentRequest,
  PaginatedIncidentsQuery,
} from '../types';

export const useIncidentsPage = (selectedVenueId: string | null) => {
  // State
  const [filters, setFilters] = useState<PaginatedIncidentsQuery>({
    page: 1,
    limit: 10,
  });

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  // Fetch incidents with filters
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

  const handleCloseFormModal = () => {
    setIsFormModalOpen(false);
    setSelectedIncident(null);
  };

  const handleCloseResolveModal = () => {
    setIsResolveModalOpen(false);
    setSelectedIncident(null);
  };

  return {
    // Data
    incidents: data?.data || [],
    total: data?.total || 0,
    page: data?.page || 1,
    limit: data?.limit || 10,
    isLoading,

    // Modals state
    isFormModalOpen,
    isResolveModalOpen,
    selectedIncident,

    // Loading states
    isFormLoading: createMutation.isPending || updateMutation.isPending,
    isResolveLoading: resolveMutation.isPending,
    isActionLoading:
      resolveMutation.isPending || closeMutation.isPending || deleteMutation.isPending,

    // Handlers
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
  };
};

