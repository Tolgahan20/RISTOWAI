import { useEffect } from 'react';

import { useQuery } from '@tanstack/react-query';
import { schedulesApi } from '@/features/smart-shifts/schedules/api';
import { useVenueSelection } from '@/features/smart-shifts/ai-scheduler/hooks/useVenueSelection';
import { useVenueStore } from '@/stores/venueStore';

export const useSchedulesList = () => {

  const { venues, isLoading: isLoadingVenues } = useVenueSelection();
  const { selectedVenueId, setSelectedVenueId } = useVenueStore();

  // Auto-select first venue
  useEffect(() => {
    if (!selectedVenueId && venues.length > 0) {
      setSelectedVenueId(venues[0].id);
    }
  }, [venues, selectedVenueId, setSelectedVenueId]);

  const { data: schedules, isLoading, isError, refetch } = useQuery({
    queryKey: ['schedules', selectedVenueId],
    queryFn: () => schedulesApi.getSchedules(selectedVenueId!),
    enabled: !!selectedVenueId,
  });

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'statusPublished';
      case 'DRAFT':
        return 'statusDraft';
      case 'ARCHIVED':
        return 'statusArchived';
      default:
        return '';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'PUBLISHED':
        return 'Pubblicato';
      case 'DRAFT':
        return 'Bozza';
      case 'ARCHIVED':
        return 'Archiviato';
      default:
        return status;
    }
  };

  const navigateToDetail = (scheduleId: string) => {
    if (selectedVenueId) {
      window.location.href = `/dashboard/schedules/${selectedVenueId}/${scheduleId}`;
    }
  };

  const navigateToGenerator = () => {
    window.location.href = '/dashboard/ai-scheduler';
  };

  return {
    venues,
    isLoadingVenues,
    selectedVenueId,
    setSelectedVenueId,
    schedules,
    isLoading,
    isError,
    refetch,
    formatDate,
    getStatusColor,
    getStatusLabel,
    navigateToDetail,
    navigateToGenerator,
  };
};

