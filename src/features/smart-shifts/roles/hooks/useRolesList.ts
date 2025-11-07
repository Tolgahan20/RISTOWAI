import { useState } from 'react';
import { useRolesPaginated, useRoleDelete } from './index';
import type { Role } from '../types';

export function useRolesList() {
  // Pagination state
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all'); // all, system, custom
  
  // Convert filterType to API filters
  const isSystem = filterType === 'system' ? true : filterType === 'custom' ? false : undefined;
  
  // Fetch paginated data
  const { data: paginatedData, isLoading, error, refetch } = useRolesPaginated(
    page,
    limit,
    {
      search: searchQuery || undefined,
      isSystem,
      isActive: true, // Only show active roles by default
    }
  );
  
  const roles = paginatedData?.data || [];
  const allRoles = roles; // Keep for compatibility
  const total = paginatedData?.total || 0;
  const totalPages = paginatedData?.totalPages || 0;

  const { handleDelete } = useRoleDelete();

  const [selectedRole, setSelectedRole] = useState<Role | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);

  const handleAdd = () => {
    setSelectedRole(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (role: Role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (role: Role) => {
    setRoleToDelete(role);
  };

  const confirmDelete = async () => {
    if (roleToDelete) {
      await handleDelete(roleToDelete.id);
      setRoleToDelete(null);
      refetch();
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRole(undefined);
    refetch();
  };

  const clearFilters = () => {
    setFilterType('all');
    setSearchQuery('');
    setPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setPage(1); // Reset to first page on search
  };

  const handleFilterTypeChange = (type: string) => {
    setFilterType(type);
    setPage(1); // Reset to first page on filter change
  };

  const hasActiveFilters = filterType !== 'all' || searchQuery.trim() !== '';
  const systemRolesCount = roles.filter(r => r.isSystem).length;
  const customRolesCount = roles.filter(r => !r.isSystem).length;

  return {
    // State
    selectedRole,
    isModalOpen,
    roleToDelete,
    searchQuery,
    filterType,
    
    // Data
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
    
    // Actions
    setSearchQuery: handleSearchChange,
    setFilterType: handleFilterTypeChange,
    setPage,
    setLimit,
    handleAdd,
    handleEdit,
    handleDeleteClick,
    confirmDelete,
    handleCloseModal,
    clearFilters,
    setRoleToDelete,
  };
}

