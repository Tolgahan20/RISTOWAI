'use client';

import React, { useEffect } from 'react';
import { EmptyState, LoadingState } from '@/components/dashboard/ui';
import { PageHeader } from '@/components/dashboard/layout';
import { ExportForm } from '@/features/smart-shifts/exports/components/ExportForm';
import { ExportList } from '@/features/smart-shifts/exports/components/ExportList';
import { useVenues } from '@/features/smart-shifts/venues/hooks';
import { useVenueStore } from '@/stores/venueStore';
import pageLayout from '@/styles/page-layout.module.css';
import styles from './exports.module.css';

export default function ExportsPage() {
  const { data: venues, isLoading: venuesLoading } = useVenues();
  const { selectedVenueId, setSelectedVenueId } = useVenueStore();

  // Auto-select first venue if none selected
  useEffect(() => {
    if (!selectedVenueId && venues && venues.length > 0) {
      setSelectedVenueId(venues[0].id);
    }
  }, [venues, selectedVenueId, setSelectedVenueId]);

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
            description="Devi prima creare un locale per gestire gli export."
            action={{
              label: 'Vai ai Locali',
              onClick: () => (window.location.href = '/dashboard/venues'),
            }}
          />
        </div>
      </div>
    );
  }

  const selectedVenue = venues.find((v) => v.id === selectedVenueId);

  return (
    <div className={pageLayout.pageContainer}>
      <PageHeader
        title="Export Dati"
        subtitle={`Genera ed esporta i dati di presenza e turni in formato CSV per ${selectedVenue?.name || 'il locale selezionato'}`}
        showVenueSelector
        venues={venues}
        selectedVenueId={selectedVenueId}
        onVenueChange={setSelectedVenueId}
      />

      {selectedVenueId ? (
        <div className={styles.content}>
          <ExportForm venueId={selectedVenueId} />
          <ExportList venueId={selectedVenueId} />
        </div>
      ) : (
        <EmptyState
          title="Seleziona un locale"
          description="Scegli un locale dal menu sopra per gestire gli export."
        />
      )}
    </div>
  );
}

