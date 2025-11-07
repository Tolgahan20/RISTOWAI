'use client';

import React, { useEffect } from 'react';
import { EmptyState, LoadingState } from '@/components/dashboard/ui';
import { PageHeader } from '@/components/dashboard/layout';
import { AbsencesList } from '@/features/smart-shifts/absences/components';
import { useVenues } from '@/features/smart-shifts/venues/hooks';
import { useVenueStore } from '@/stores/venueStore';
import { useStaff } from '@/features/smart-shifts/staff/hooks';
import pageLayout from '@/styles/page-layout.module.css';
import styles from './absences.module.css';

export default function AbsencesPage() {
  const { data: venues, isLoading: venuesLoading } = useVenues();
  const { selectedVenueId, setSelectedVenueId } = useVenueStore();

  // Fetch staff for the selected venue
  const { data: staffData } = useStaff(selectedVenueId || '', 1, 1000); // Get all staff for selector

  // Auto-select first venue if none selected
  useEffect(() => {
    if (!selectedVenueId && venues && venues.length > 0) {
      setSelectedVenueId(venues[0].id);
    }
  }, [venues, selectedVenueId, setSelectedVenueId]);

  // Transform staff data for the list
  const staffList = staffData?.data.map((staff) => ({
    id: staff.id,
    name: `${staff.firstName} ${staff.lastName}`.trim() || 'Senza nome',
  })) || [];

  if (venuesLoading) {
    return <LoadingState message="Caricamento..." />;
  }

  // No venues at all
  if (!venues || venues.length === 0) {
    return (
      <div className={pageLayout.pageContainer}>
        <div className={styles.fullPageEmpty}>
          <EmptyState
            title="Nessun locale disponibile"
            description="Devi prima creare un locale per gestire le assenze."
            action={{
              label: 'Vai ai Locali',
              onClick: () => window.location.href = '/dashboard/venues',
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={pageLayout.pageContainer}>
      <PageHeader
        title="Gestione Assenze"
        subtitle="Visualizza e gestisci le assenze del personale"
        showVenueSelector
        venues={venues}
        selectedVenueId={selectedVenueId}
        onVenueChange={setSelectedVenueId}
      />

      {selectedVenueId ? (
        <AbsencesList venueId={selectedVenueId} staffList={staffList} />
      ) : (
        <EmptyState
          title="Seleziona un locale"
          description="Scegli un locale dal menu sopra per visualizzare e gestire le assenze."
        />
      )}
    </div>
  );
}

