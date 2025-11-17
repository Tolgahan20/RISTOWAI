'use client';

import React from 'react';
import { EmptyState, LoadingState } from '@/components/dashboard/ui';
import { PageHeader } from '@/components/dashboard/layout';
import { AbsencesList } from '@/features/smart-shifts/absences/components';
import { useAbsencesPage } from '@/features/smart-shifts/absences/hooks';
import pageLayout from '@/styles/page-layout.module.css';
import styles from './absences.module.css';

export default function AbsencesPage() {
  const {
    venues,
    venuesLoading,
    selectedVenueId,
    setSelectedVenueId,
    staffList,
    navigateToVenues,
  } = useAbsencesPage();

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
              onClick: navigateToVenues,
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

