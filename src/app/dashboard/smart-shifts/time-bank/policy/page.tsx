'use client';

import React from 'react';
import { useVenueSelection } from '@/features/smart-shifts/ai-scheduler/hooks/useVenueSelection';
import { PageHeader } from '@/components/dashboard/layout';
import { VenueSelector as VenueSelectorComponent } from '@/components/dashboard/ui';
import { BalancePolicyForm } from '@/features/smart-shifts/time-bank/components';
import pageLayout from '@/styles/page-layout.module.css';

export default function TimeBankPolicyPage() {
  const { venues, selectedVenueId, setSelectedVenueId } = useVenueSelection();

  // If no venue selected, show venue selector
  if (!selectedVenueId) {
    return (
      <div className={pageLayout.pageContainer}>
        <PageHeader
          title="Configurazione Banca Ore"
          subtitle="Imposta i parametri per il calcolo dei saldi"
        />
        <VenueSelectorComponent
          venues={venues}
          selectedVenueId={selectedVenueId}
          onVenueChange={setSelectedVenueId}
        />
      </div>
    );
  }

  return (
    <div className={pageLayout.pageContainer}>
      <PageHeader
        title="Configurazione Banca Ore"
        subtitle="Parametri per ferie, ROL e banca ore (solo visivi)"
        showVenueSelector
        venues={venues}
        selectedVenueId={selectedVenueId}
        onVenueChange={setSelectedVenueId}
        showBackButton
        backButtonUrl="/dashboard/smart-shifts/time-bank"
      />

      <BalancePolicyForm venueId={selectedVenueId} />
    </div>
  );
}

