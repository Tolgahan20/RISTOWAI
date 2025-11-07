import { useState } from 'react';
import { useShiftSnapshots } from './useShiftSnapshots';
import type { SnapshotStatus, SnapshotFilters } from '../types';

export const useSnapshotsList = (venueId: string) => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [filterStatus, setFilterStatus] = useState<SnapshotStatus | ''>('');
  const [filterStartDateFrom, setFilterStartDateFrom] = useState('');
  const [filterStartDateTo, setFilterStartDateTo] = useState('');

  const filters: SnapshotFilters = {};
  if (filterStatus) filters.status = filterStatus;
  if (filterStartDateFrom) filters.startDateFrom = filterStartDateFrom;
  if (filterStartDateTo) filters.startDateTo = filterStartDateTo;

  const { data, isLoading, error } = useShiftSnapshots(
    venueId,
    page,
    limit,
    filters
  );

  const handleStatusChange = (status: SnapshotStatus | '') => {
    setFilterStatus(status);
    setPage(1); // Reset to first page when filter changes
  };

  const handleStartDateFromChange = (date: string) => {
    setFilterStartDateFrom(date);
    setPage(1);
  };

  const handleStartDateToChange = (date: string) => {
    setFilterStartDateTo(date);
    setPage(1);
  };

  const clearFilters = () => {
    setFilterStatus('');
    setFilterStartDateFrom('');
    setFilterStartDateTo('');
    setPage(1);
  };

  return {
    snapshots: data?.data || [],
    total: data?.total || 0,
    page,
    totalPages: data?.totalPages || 0,
    limit,
    isLoading,
    error,
    filterStatus,
    filterStartDateFrom,
    filterStartDateTo,
    setPage,
    setLimit,
    setFilterStatus: handleStatusChange,
    setFilterStartDateFrom: handleStartDateFromChange,
    setFilterStartDateTo: handleStartDateToChange,
    clearFilters,
  };
};

