'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/layout';
import { VenueSelector as VenueSelectorComponent } from '@/components/dashboard/ui';
import { useVenueSelection } from '@/features/smart-shifts/ai-scheduler/hooks/useVenueSelection';
import { useDashboardData } from '@/features/smart-shifts/dashboard/hooks';
import { 
  EmergencySection, 
  WeekOverview, 
  NeedsApproval, 
  QuickActions 
} from '@/features/smart-shifts/dashboard/components';
import { ContractAlertsPanel } from '@/features/smart-shifts/contract-alerts/components';
import pageLayout from '@/styles/page-layout.module.css';
import styles from './page.module.css';

export default function DashboardPage() {
  const { venues, selectedVenueId, setSelectedVenueId } = useVenueSelection();
  const [showAlerts, setShowAlerts] = useState(false);

  // Date range for this week
  const [dateRange] = useState(() => {
    const start = new Date();
    const end = new Date();
    end.setDate(end.getDate() + 7);
    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
    };
  });

  // Fetch all dashboard data with the custom hook
  const {
    isLoading,
    todayEmergencies,
    weekSummary,
    weekDetails,
    approvals,
  } = useDashboardData({
    venueId: selectedVenueId || '',
    dateRange,
  });

  // Show venue selector if no venue is selected
  if (!selectedVenueId) {
    return (
      <VenueSelectorComponent
        venues={venues}
        selectedVenueId={selectedVenueId}
        onVenueChange={setSelectedVenueId}
      />
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div className={pageLayout.container}>
        <PageHeader
          title="Dashboard"
          subtitle="Caricamento..."
          showVenueSelector
          venues={venues}
          selectedVenueId={selectedVenueId}
          onVenueChange={setSelectedVenueId}
        />
        <div className={styles.loadingState}>Caricamento dati...</div>
      </div>
    );
  }

  // Error state
  if (!todayEmergencies || !weekSummary || !approvals) {
    return (
      <div className={pageLayout.container}>
        <PageHeader
          title="Dashboard"
          subtitle="Errore"
          showVenueSelector
          venues={venues}
          selectedVenueId={selectedVenueId}
          onVenueChange={setSelectedVenueId}
        />
        <div className={styles.errorState}>Errore nel caricamento dei dati</div>
      </div>
    );
  }

  return (
    <div className={pageLayout.container}>
      <PageHeader
        title="Dashboard"
        subtitle={`Panoramica per ${venues.find(v => v.id === selectedVenueId)?.name || 'Locale'}`}
        showVenueSelector
        venues={venues}
        selectedVenueId={selectedVenueId}
        onVenueChange={setSelectedVenueId}
      />

      {/* PRIORITY 1: Emergency Section */}
      <EmergencySection
        uncoveredPhases={todayEmergencies.uncoveredPhases}
        criticalAlerts={todayEmergencies.criticalAlerts}
        hasEmergencies={todayEmergencies.hasEmergencies}
        onViewAlerts={() => setShowAlerts(true)}
      />

      {/* PRIORITY 2: Week Overview */}
      <WeekOverview
        summary={weekSummary}
        weekDetails={weekDetails}
      />

      {/* PRIORITY 3: Needs Approval */}
      <NeedsApproval
        approvals={approvals}
        onViewAlerts={() => setShowAlerts(true)}
      />

      {/* PRIORITY 4: Quick Actions */}
      <QuickActions />

      {/* Contract Alerts Modal */}
      {showAlerts && selectedVenueId && (
        <div className={styles.modalOverlay} onClick={() => setShowAlerts(false)}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <ContractAlertsPanel
              venueId={selectedVenueId}
              onClose={() => setShowAlerts(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
