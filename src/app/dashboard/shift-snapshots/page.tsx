'use client';

import { PageHeader } from '@/components/dashboard/layout';
import { VenueSelector as VenueSelectorComponent } from '@/components/dashboard/ui';
import { useVenueSelection } from '@/features/smart-shifts/ai-scheduler/hooks/useVenueSelection';
import { SnapshotsList } from '@/features/smart-shifts/shift-snapshots/components';
import pageLayout from '@/styles/page-layout.module.css';

export default function ShiftSnapshotsPage() {
  const { venues, selectedVenueId, setSelectedVenueId } = useVenueSelection();

  if (!selectedVenueId) {
    return (
      <VenueSelectorComponent
        venues={venues}
        selectedVenueId={selectedVenueId}
        onVenueChange={setSelectedVenueId}
      />
    );
  }

  return (
    <div className={pageLayout.pageContainer}>
      <PageHeader
        title="Snapshot Turni"
        subtitle="Gestisci le versioni pubblicate dei turni"
        showVenueSelector
        venues={venues}
        selectedVenueId={selectedVenueId}
        onVenueChange={setSelectedVenueId}
      />
      <SnapshotsList venueId={selectedVenueId} />
    </div>
  );
}

