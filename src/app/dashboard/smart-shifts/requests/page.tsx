'use client';

import React, { useState } from 'react';
import { FileText } from 'react-feather';
import { PageHeader } from '@/components/dashboard/layout';
import { EmptyState } from '@/components/dashboard/ui';
import { RequestsList, RequestModal } from '@/features/smart-shifts/requests/components';
import { useVenues } from '@/features/smart-shifts/venues/hooks';
import { useStaff } from '@/features/smart-shifts/staff/hooks';
import { useVenueStore } from '@/stores/venueStore';
import type { Request } from '@/features/smart-shifts/requests/types';
import type { Staff } from '@/features/smart-shifts/staff/types';
import pageLayout from '@/styles/page-layout.module.css';
import styles from './requests.module.css';

export default function RequestsPage() {
  const { data: venues = [], isLoading: venuesLoading } = useVenues();
  const { selectedVenueId, setSelectedVenueId } = useVenueStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<Request | undefined>();

  // Auto-select first venue if none selected
  React.useEffect(() => {
    if (venues.length > 0 && !selectedVenueId) {
      setSelectedVenueId(venues[0].id);
    }
  }, [venues, selectedVenueId, setSelectedVenueId]);

  const { data: staffResponse } = useStaff(selectedVenueId || '');

  const handleOpenModal = (request?: Request) => {
    setEditingRequest(request);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingRequest(undefined);
    setIsModalOpen(false);
  };

  const staff = staffResponse?.data || [];
  const staffList = staff.map((s: Staff) => ({
    id: s.id,
    name: `${s.firstName} ${s.lastName}`,
  }));

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
              onClick: () => {
                window.location.href = '/dashboard/venues';
              },
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

  const selectedVenue = venues.find((v) => v.id === selectedVenueId);

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

