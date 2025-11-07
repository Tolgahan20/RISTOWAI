import { useState } from 'react';
import { usePhasesPaginated, usePhaseDelete } from './';
import type { Phase, PhaseType } from '../types';

export const usePhasesList = (venueId: string) => {
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  
  // Filters
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<PhaseType | undefined>();
  const [filterDay, setFilterDay] = useState<number | undefined>();
  const [filterActive, setFilterActive] = useState<boolean | undefined>();

  // Fetch paginated data
  const { data: paginatedData, isLoading, error, refetch } = usePhasesPaginated(
    venueId,
    page,
    limit,
    {
      search: search || undefined,
      type: filterType,
      dayOfWeek: filterDay,
      activeOnly: filterActive,
    }
  );
  
  const phases = paginatedData?.data || [];
  const total = paginatedData?.total || 0;
  const totalPages = paginatedData?.totalPages || 0;

  const { handleDelete } = usePhaseDelete(venueId);

  const [selectedPhase, setSelectedPhase] = useState<Phase | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [phaseToDelete, setPhaseToDelete] = useState<Phase | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);

  const handleAdd = () => {
    setSelectedPhase(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (phase: Phase) => {
    setSelectedPhase(phase);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (phase: Phase) => {
    setPhaseToDelete(phase);
  };

  const confirmDelete = async () => {
    if (phaseToDelete) {
      await handleDelete(phaseToDelete.id);
      setPhaseToDelete(null);
      refetch();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhase(undefined);
    refetch();
  };

  const clearFilters = () => {
    setSearch('');
    setFilterType(undefined);
    setFilterDay(undefined);
    setFilterActive(undefined);
    setPage(1); // Reset to first page when clearing filters
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const toggleStats = () => {
    setShowStats(!showStats);
  };

  // Reset to first page when filters change
  const handleSetFilterType = (type: string) => {
    setFilterType(type ? (type as PhaseType) : undefined);
    setPage(1);
  };

  const handleSetFilterDay = (day: string) => {
    const dayValue = day ? parseInt(day, 10) : undefined;
    setFilterDay(dayValue);
    setPage(1);
  };

  const handleSetFilterActive = (active: string) => {
    let activeValue: boolean | undefined;
    if (active === 'true') activeValue = true;
    else if (active === 'false') activeValue = false;
    else activeValue = undefined;
    
    setFilterActive(activeValue);
    setPage(1);
  };

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm);
    setPage(1);
  };

  const hasActiveFilters = !!search || !!filterType || filterDay !== undefined || filterActive !== undefined;

  return {
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
    search,
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
    setSearch: handleSearch,
    setFilterType: handleSetFilterType,
    setFilterDay: handleSetFilterDay,
    setFilterActive: handleSetFilterActive,
    setPhaseToDelete,
  };
};

