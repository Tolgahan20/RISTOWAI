'use client';

import { PageHeader } from '@/components/dashboard/layout';
import { VenueSelector as VenueSelectorComponent, Select, EmptyState } from '@/components/dashboard/ui';
import { useVenueSelection } from '@/features/smart-shifts/ai-scheduler/hooks/useVenueSelection';
import {
  PunchClockWidget,
  AnomaliesPanel,
  TimeEventsList,
} from '@/features/smart-shifts/punch-clock';
import { usePunchClockPage } from '@/features/smart-shifts/punch-clock/hooks';
import pageLayout from '@/styles/page-layout.module.css';
import styles from './punch-clock.module.css';

export default function PunchClockPage() {
  const { venues, selectedVenueId, setSelectedVenueId } = useVenueSelection();

  // All page logic is now in the custom hook
  const {
    activeTab,
    setActiveTab,
    selectedStaffId,
    setSelectedStaffId,
    staffList,
    getSubtitle,
    getFullName,
  } = usePunchClockPage(selectedVenueId);

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

  return (
    <div className={pageLayout.pageContainer}>
      <PageHeader
        title="Punch Clock"
        subtitle={getSubtitle()}
        showVenueSelector={venues.length > 1}
        venues={venues.map((v) => ({ id: v.id, name: v.name, address: v.address || '' }))}
        selectedVenueId={selectedVenueId}
        onVenueChange={setSelectedVenueId}
      />

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'clock' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('clock')}
        >
          Timbratura
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'history' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Cronologia
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'anomalies' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('anomalies')}
        >
          Anomalie
        </button>
      </div>

      <div className={styles.tabContent}>
        {/* Show staff selector for Clock and History tabs */}
        {(activeTab === 'clock' || activeTab === 'history') && (
          <div className={styles.staffSelector}>
            <label htmlFor="staff-select" className={styles.staffSelectorLabel}>
              Seleziona Dipendente:
            </label>
            <Select
              id="staff-select"
              value={selectedStaffId}
              onChange={(e) => setSelectedStaffId(e.target.value)}
            >
              <option value="">Seleziona un dipendente</option>
              {staffList.map((staff) => (
                <option key={staff.id} value={staff.id}>
                  {getFullName(staff)}
                </option>
              ))}
            </Select>
          </div>
        )}

        {/* Clock Tab */}
        {activeTab === 'clock' && (
          <>
            {selectedStaffId ? (
              <PunchClockWidget
                staffId={selectedStaffId}
                venueId={selectedVenueId}
              />
            ) : (
              <EmptyState
                title="Seleziona un dipendente"
                description="Scegli un dipendente dal menu sopra per gestire le timbrature."
              />
            )}
          </>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <>
            {selectedStaffId ? (
              <TimeEventsList
                staffId={selectedStaffId}
                venueId={selectedVenueId}
              />
            ) : (
              <EmptyState
                title="Seleziona un dipendente"
                description="Scegli un dipendente dal menu sopra per visualizzare la cronologia."
              />
            )}
          </>
        )}

        {/* Anomalies Tab (admin view - no staff selection needed) */}
        {activeTab === 'anomalies' && (
          <AnomaliesPanel venueId={selectedVenueId} />
        )}
      </div>
    </div>
  );
}

