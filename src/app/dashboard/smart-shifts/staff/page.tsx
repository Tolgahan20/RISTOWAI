'use client';

import React from 'react';
import { MapPin, BarChart2, List, Users } from 'react-feather';
import { Button, LoadingState, EmptyState } from '@/components/dashboard/ui';
import { PageHeader } from '@/components/dashboard/layout';
import { StaffTable, StaffModal, StaffStats } from '@/features/smart-shifts/staff/components';
import { useStaffManagement } from './hooks/useStaffManagement';
import pageLayout from '@/styles/page-layout.module.css';
import styles from './staff.module.css';

export default function StaffPage() {
  const {
    venues,
    venuesLoading,
    selectedVenueId,
    setSelectedVenueId,
    selectedStaff,
    isModalOpen,
    viewMode,
    setViewMode,
    handleAdd,
    handleEdit,
    handleCloseModal,
  } = useStaffManagement();

  if (venuesLoading) {
    return <LoadingState message="Caricamento locali..." />;
  }

  if (!venues || venues.length === 0) {
    return (
      <div className={pageLayout.pageContainer}>
        <div className={styles.fullPageEmpty}>
          <EmptyState
            icon={<MapPin size={64} />}
            title="Nessun locale disponibile"
            description="Prima di poter gestire il personale, devi creare almeno un locale per il tuo ristorante."
            action={{ label: 'Crea il tuo primo locale', onClick: () => window.location.href = '/dashboard/smart-shifts/venues' }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={pageLayout.pageContainer}>
      <PageHeader
        title="Gestione Staff"
        subtitle="Gestisci i dipendenti del tuo locale"
        showVenueSelector
        venues={venues}
        selectedVenueId={selectedVenueId}
        onVenueChange={setSelectedVenueId}
        actions={
          selectedVenueId && (
            <div className={styles.viewToggle}>
              <Button
                variant={viewMode === 'table' ? 'primary' : 'ghost'}
                onClick={() => setViewMode('table')}
                className={styles.toggleButton}
              >
                <List size={16} />
                Lista
              </Button>
              <Button
                variant={viewMode === 'stats' ? 'primary' : 'ghost'}
                onClick={() => setViewMode('stats')}
                className={styles.toggleButton}
              >
                <BarChart2 size={16} />
                Statistiche
              </Button>
            </div>
          )
        }
      />

      {!selectedVenueId && (
        <div className={styles.centerEmptyState}>
          <div className={styles.emptyStateCard}>
            <div className={styles.emptyIconWrapper}>
              <Users size={64} strokeWidth={1.5} />
            </div>
            <h3 className={styles.emptyTitle}>Seleziona un locale</h3>
            <p className={styles.emptyDescription}>
              Scegli un locale dal menu a tendina sopra per visualizzare e gestire il personale
            </p>
          </div>
        </div>
      )}

      {selectedVenueId && (
        viewMode === 'table' ? (
          <StaffTable
            venueId={selectedVenueId}
            onEdit={handleEdit}
            onAdd={handleAdd}
          />
        ) : (
          <StaffStats venueId={selectedVenueId} />
        )
      )}

      <StaffModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        staff={selectedStaff}
        venueId={selectedVenueId || ''}
      />
    </div>
  );
}

