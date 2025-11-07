import { useState } from 'react';
import { useStaff, useStaffDelete } from './index';
import type { Staff, StaffFilters } from '../types';

export interface UseStaffTableProps {
  venueId: string;
}

export function useStaffTable({ venueId }: UseStaffTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [filters, setFilters] = useState<StaffFilters>({});
  const [searchInput, setSearchInput] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useStaff(venueId, page, pageSize, filters);
  const { handleDelete: deleteStaff, isDeleting } = useStaffDelete(venueId);

  const handleFilterChange = (key: keyof StaffFilters, value: string | boolean | undefined) => {
    setFilters((prev) => {
      const newFilters = { ...prev } as StaffFilters;
      if (value === '' || value === undefined) {
        delete newFilters[key];
      } else {
        (newFilters as Record<string, string | boolean | undefined>)[key] = value;
      }
      return newFilters;
    });
    setPage(1);
  };

  const handleClearFilters = () => {
    setFilters({});
    setSearchInput('');
    setPage(1);
  };

  const handleDeleteClick = (staffId: string) => {
    setStaffToDelete(staffId);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (staffToDelete) {
      deleteStaff(staffToDelete);
      setDeleteModalOpen(false);
      setStaffToDelete(null);
    }
  };

  const handleViewSchedule = (staffId: string) => {
    window.location.href = `/dashboard/staff/${staffId}/schedule`;
  };

  const getFullName = (staff: Staff) => {
    if (staff.firstName && staff.lastName) {
      return `${staff.firstName} ${staff.lastName}`;
    }
    return staff.email || 'N/A';
  };

  const isActive = (staff: Staff) => {
    if (!staff.endDate) return true;
    return new Date(staff.endDate) > new Date();
  };

  const hasFilters = filters.search || filters.role || filters.contractType || filters.activeOnly;

  return {
    // State
    page,
    pageSize,
    filters,
    searchInput,
    showFilters,
    deleteModalOpen,
    staffToDelete,
    
    // Data
    data,
    isLoading,
    isError,
    isDeleting,
    hasFilters,
    
    // Actions
    setPage,
    setPageSize,
    setSearchInput,
    setShowFilters,
    setDeleteModalOpen,
    handleFilterChange,
    handleClearFilters,
    handleDeleteClick,
    handleConfirmDelete,
    handleViewSchedule,
    refetch,
    
    // Helpers
    getFullName,
    isActive,
  };
}

