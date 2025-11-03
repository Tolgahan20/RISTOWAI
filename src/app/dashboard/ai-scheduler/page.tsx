'use client';

import { VenueSelector } from '@/features/smart-shifts/ai-scheduler/components/VenueSelector';
import { ScheduleGenerator } from '@/features/smart-shifts/ai-scheduler/components/ScheduleGenerator';
import { useVenueSelection } from '@/features/smart-shifts/ai-scheduler/hooks/useVenueSelection';

export default function AISchedulerPage() {
  const { venues, selectedVenueId, setSelectedVenueId, isLoading } =
    useVenueSelection();

  // Show venue selector if no venue is selected
  if (!selectedVenueId) {
    return (
      <VenueSelector
        venues={venues}
        selectedVenueId={selectedVenueId}
        onSelectVenue={setSelectedVenueId}
        isLoading={isLoading}
      />
    );
  }

  // Show schedule generator once a venue is selected
  return <ScheduleGenerator venueId={selectedVenueId} />;
}
