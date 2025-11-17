'use client';

import { PhasesList } from '@/features/smart-shifts/phases/components';
import { EmptyState } from '@/components/dashboard/ui';
import { PageHeader } from '@/components/dashboard/layout';
import { usePhasesManagement } from '@/features/smart-shifts/phases/hooks';
import pageLayout from '@/styles/page-layout.module.css';

export default function PhasesPage() {
  const {
    venues,
    selectedVenueId,
    setSelectedVenueId,
    navigateToVenues,
  } = usePhasesManagement();

  if (!venues || venues.length === 0) {
    return (
      <div className={pageLayout.pageContainer}>
        <EmptyState
          title="Nessun locale disponibile"
          description="Crea prima un locale per gestire le fasi operative."
          action={{
            label: 'Vai ai Locali',
            onClick: navigateToVenues,
          }}
        />
      </div>
    );
  }

  return (
    <div className={pageLayout.pageContainer}>
      <PageHeader
        title="Gestione Fasi"
        subtitle="Configura le fasi operative del tuo locale"
        showVenueSelector
        venues={venues}
        selectedVenueId={selectedVenueId}
        onVenueChange={setSelectedVenueId}
      />

      {selectedVenueId ? (
        <PhasesList venueId={selectedVenueId} />
      ) : (
        <EmptyState
          title="Seleziona un locale"
          description="Scegli un locale dal menu sopra per gestire le fasi operative."
        />
      )}
    </div>
  );
}
