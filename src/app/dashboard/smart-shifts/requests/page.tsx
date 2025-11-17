'use client';

import React from 'react';
import { FileText } from 'react-feather';
import { PageHeader } from '@/components/dashboard/layout';
import { EmptyState } from '@/components/dashboard/ui';
import { RequestsList, RequestModal } from '@/features/smart-shifts/requests/components';
import { useRequestsPage } from '@/features/smart-shifts/requests/hooks';
import pageLayout from '@/styles/page-layout.module.css';
import styles from './requests.module.css';

export default function RequestsPage() {
  // All page logic is now in the custom hook
  const {
    venues,
    venuesLoading,
    selectedVenueId,
    setSelectedVenueId,
    selectedVenue,
    staffList,
    isModalOpen,
    editingRequest,
    handleOpenModal,
    handleCloseModal,
    navigateToVenues,
  } = useRequestsPage();

  if (venuesLoading) {
    return (
      <div className={pageLayout.pageContainer}>
        <PageHeader title="Richieste" subtitle="Caricamento..." />
      </div>
    );
  }

  if (!venues || venues.length === 0) {
    return (
      <div className={pageLayout.pageContainer}>
        <PageHeader title="Richieste" subtitle="Gestisci le richieste del personale" />
        <div className={styles.fullPageEmpty}>
          <EmptyState
            title="Nessun locale disponibile"
            description="Crea prima un locale per gestire le richieste del personale."
            action={{
              label: 'Vai ai Locali',
              onClick: navigateToVenues,
            }}
          />
        </div>
      </div>
    );
  }

  if (!selectedVenueId) {
    return (
      <div className={pageLayout.pageContainer}>
        <PageHeader
          title="Richieste"
          subtitle="Gestisci le richieste del personale"
          showVenueSelector
          venues={venues}
          selectedVenueId={selectedVenueId || ''}
          onVenueChange={(venueId) => setSelectedVenueId(venueId)}
        />
        <div className={styles.fullPageEmpty}>
          <EmptyState
            title="Seleziona un locale"
            description="Seleziona un locale per visualizzare e gestire le richieste."
          />
        </div>
      </div>
    );
  }

  return (
    <div className={pageLayout.pageContainer}>
      <PageHeader
        title="Richieste"
        subtitle={`Gestisci le richieste di ${selectedVenue?.name || 'questo locale'}`}
        showVenueSelector
        venues={venues}
        selectedVenueId={selectedVenueId}
        onVenueChange={(venueId) => setSelectedVenueId(venueId)}
        actions={
          <button
            onClick={() => handleOpenModal()}
            className={styles.createButton}
          >
            <FileText size={16} />
            Nuova Richiesta
          </button>
        }
      />

      <RequestsList
        venueId={selectedVenueId}
        staffList={staffList}
        onOpenModal={handleOpenModal}
      />

      {isModalOpen && (
        <RequestModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          venueId={selectedVenueId}
          request={editingRequest}
          staffList={staffList}
        />
      )}
    </div>
  );
}

