import { useState } from 'react';
import { useRequestsPaginated } from './useRequests';
import { useRequestActions } from './useRequestActions';
import type { RequestFilters, RequestStatus, RequestType } from '../types';

interface UseRequestsListProps {
  venueId: string;
}

export const useRequestsList = ({ venueId }: UseRequestsListProps) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Filters state
  const [searchInput, setSearchInput] = useState('');
  const [selectedStaff, setSelectedStaff] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  // Build filters for API
  const filters: RequestFilters = {
    search: searchInput || undefined,
    staffId: selectedStaff || undefined,
    status: selectedStatus ? (selectedStatus as RequestStatus) : undefined,
    type: selectedType ? (selectedType as RequestType) : undefined,
  };

  // Fetch paginated data
  const { data: paginatedData, isLoading, error, refetch } = useRequestsPaginated(
    venueId,
    currentPage,
    pageSize,
    filters
  );

  const requests = paginatedData?.data || [];
  const totalItems = paginatedData?.total || 0;
  const totalPages = paginatedData?.totalPages || 0;

  const actions = useRequestActions({ venueId });

  const handleSearch = (value: string) => {
    setSearchInput(value);
    setCurrentPage(1);
  };

  const handleFilterChange = (filterName: string, value: string) => {
    switch (filterName) {
      case 'staff':
        setSelectedStaff(value);
        break;
      case 'status':
        setSelectedStatus(value);
        break;
      case 'type':
        setSelectedType(value);
        break;
    }
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSearchInput('');
    setSelectedStaff('');
    setSelectedStatus('');
    setSelectedType('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  return {
    requests,
    isLoading,
    error,
    searchInput,
    selectedStaff,
    selectedStatus,
    selectedType,
    currentPage,
    pageSize,
    totalPages,
    totalItems,
    handleSearch,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handlePageSizeChange,
    actions,
    refetch,
  };
};

