import { useState } from 'react';
import { useAbsencesPaginated, useAbsenceActions } from './index';
import type { Absence, AbsenceFilters } from '../types';

export interface UseAbsencesListProps {
  venueId: string;
}

export function useAbsencesList({ venueId }: UseAbsencesListProps) {
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  
  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Omit<AbsenceFilters, 'search'>>({});
  
  const [selectedAbsence, setSelectedAbsence] = useState<Absence | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [absenceToDelete, setAbsenceToDelete] = useState<Absence | null>(null);
  const [absenceToApprove, setAbsenceToApprove] = useState<Absence | null>(null);

  // Fetch paginated data
  const { data: paginatedData, isLoading, error, refetch } = useAbsencesPaginated(
    venueId,
    page,
    limit,
    {
      search: searchQuery || undefined,
      ...filters,
    }
  );

  const absences = paginatedData?.data || [];
  const total = paginatedData?.total || 0;
  const totalPages = paginatedData?.totalPages || 0;

  const { handleDelete, handleApprove, handleReject } = useAbsenceActions(venueId);

  const handleAdd = () => {
    setSelectedAbsence(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (absence: Absence) => {
    setSelectedAbsence(absence);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (absence: Absence) => {
    setAbsenceToDelete(absence);
  };

  const confirmDelete = async () => {
    if (absenceToDelete) {
      await handleDelete(absenceToDelete.id);
      setAbsenceToDelete(null);
      refetch();
    }
  };

  const handleApproveClick = (absence: Absence) => {
    setAbsenceToApprove(absence);
  };

  const confirmApprove = async (
    visualizeAs: 'VACATION' | 'ROL' | 'NONE',
    hoursOverride?: number,
    notes?: string
  ) => {
    if (absenceToApprove) {
      await handleApprove(absenceToApprove.id, {
        visualizeAs,
        hoursOverride,
        managerNotes: notes,
      });
      setAbsenceToApprove(null);
      await refetch();
    }
  };

  const handleRejectClick = async (id: string) => {
    await handleReject(id);
    refetch();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAbsence(undefined);
    refetch();
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on search
  };

  const handleFilterChange = (newFilters: Omit<AbsenceFilters, 'search'>) => {
    setFilters(newFilters);
    setPage(1); // Reset to first page on filter change
  };

  const clearFilters = () => {
    setFilters({});
    setSearchQuery('');
    setPage(1);
  };

  const hasActiveFilters = Object.keys(filters).length > 0 || searchQuery.trim() !== '';

  return {
    // State
    filters,
    searchQuery,
    selectedAbsence,
    isModalOpen,
    absenceToDelete,
    absenceToApprove,
    
    // Pagination
    page,
    totalPages,
    limit,
    total,
    
    // Data
    absences,
    isLoading,
    error,
    hasActiveFilters,
    
    // Actions
    setFilters: handleFilterChange,
    setSearchQuery: handleSearchChange,
    setPage,
    setLimit: (size: number) => {
      setLimit(size);
      setPage(1);
    },
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
    refetch,
  };
}

