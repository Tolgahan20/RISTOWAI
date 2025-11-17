'use client';

import { PageHeader } from '@/components/dashboard/layout';
import { VenueSelector } from '@/features/smart-shifts/ai-scheduler/components/VenueSelector';
import { ScheduleGenerator } from '@/features/smart-shifts/ai-scheduler/components/ScheduleGenerator';
import { JobHistory } from '@/features/smart-shifts/ai-scheduler/components/JobHistory';
import { useVenueSelection, useAISchedulerPage } from '@/features/smart-shifts/ai-scheduler/hooks';
import pageLayout from '@/styles/page-layout.module.css';
import styles from './page.module.css';

export default function AISchedulerPage() {
  const { venues, selectedVenueId, setSelectedVenueId, isLoading } = useVenueSelection();
  const { activeTab, setActiveTab, subtitle } = useAISchedulerPage();

  // Show venue selector if no venue is selected
  if (!selectedVenueId) {
    return (
      <VenueSelector
        venues={venues}
        selectedVenueId={selectedVenueId}
        onSelectVenue={setSelectedVenueId}
        isLoading={isLoading}
      />
    );
  }

  return (
    <div className={pageLayout.pageContainer}>
      <PageHeader
        title="Generatore Turni AI"
        subtitle={subtitle}
        showVenueSelector={venues.length > 1}
        venues={venues.map(v => ({ id: v.id, name: v.name, address: v.address }))}
        selectedVenueId={selectedVenueId}
        onVenueChange={setSelectedVenueId}
      />

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'generator' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('generator')}
        >
          Genera Turni
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'history' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Cronologia
        </button>
      </div>

      <div className={styles.tabContent}>
        {activeTab === 'generator' && <ScheduleGenerator venueId={selectedVenueId} />}
        {activeTab === 'history' && <JobHistory />}
      </div>
    </div>
  );
}
