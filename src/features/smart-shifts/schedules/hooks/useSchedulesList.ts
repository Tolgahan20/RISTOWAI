import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useVenues } from '@/features/smart-shifts/venues/hooks';
import { useSchedules } from './useSchedules';
import { formatDateWithYear } from '@/features/smart-shifts/common/utils/dateHelpers';
import { getStatusColor, getStatusLabel } from '@/features/smart-shifts/schedules/utils';

export const useSchedulesList = () => {
  const router = useRouter();
  const { data: venues = [], isLoading: isLoadingVenues } = useVenues();
  const [selectedVenueId, setSelectedVenueId] = useState<string | null>(null);

  // Auto-select first venue
  useEffect(() => {
    if (venues.length > 0 && !selectedVenueId) {
      setTimeout(() => {
        setSelectedVenueId(venues[0].id);
      }, 0);
    }
  }, [venues, selectedVenueId]);

  // Fetch schedules for selected venue
  const {
    data: schedules,
    isLoading,
    isError,
    refetch,
  } = useSchedules(selectedVenueId || '');

  // Navigation helpers
  const navigateToDetail = (scheduleId: string) => {
    if (selectedVenueId) {
      router.push(`/dashboard/smart-shifts/schedules/${selectedVenueId}/${scheduleId}`);
    }
  };

  const navigateToGenerator = () => {
    router.push('/dashboard/smart-shifts/ai-scheduler');
  };

  return {
    venues,
    isLoadingVenues,
    selectedVenueId,
    setSelectedVenueId,
    schedules: schedules || [],
    isLoading,
    isError,
    refetch,
    formatDate: formatDateWithYear,
    getStatusColor,
    getStatusLabel,
    navigateToDetail,
    navigateToGenerator,
  };
};

