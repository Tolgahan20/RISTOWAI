'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/dashboard/layout';
import { VenueSelector as VenueSelectorComponent, Select, EmptyState } from '@/components/dashboard/ui';
import { useVenueSelection } from '@/features/smart-shifts/ai-scheduler/hooks/useVenueSelection';
import { useStaff } from '@/features/smart-shifts/staff/hooks/useStaff';
import {
  PunchClockWidget,
  AnomaliesPanel,
  TimeEventsList,
} from '@/features/smart-shifts/punch-clock';
import pageLayout from '@/styles/page-layout.module.css';
import styles from './punch-clock.module.css';

type Tab = 'clock' | 'history' | 'anomalies';

export default function PunchClockPage() {
  const { venues, selectedVenueId, setSelectedVenueId } = useVenueSelection();
  const [activeTab, setActiveTab] = useState<Tab>('anomalies'); // Default to anomalies for admins
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  
  // Fetch staff list for the selected venue (for admin staff selection)
  const { data: staffData } = useStaff(selectedVenueId || '', 1, 100);
  const staffList = staffData?.data || [];

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

  const getSubtitle = () => {
    switch (activeTab) {
      case 'clock':
        return 'Timbra entrata e uscita';
      case 'history':
        return 'Visualizza la cronologia delle timbrature';
      case 'anomalies':
        return 'Gestisci le anomalie delle timbrature';
      default:
        return 'Gestione timbrature';
    }
  };

  const getFullName = (staff: typeof staffList[0]) => {
    if (staff.firstName && staff.lastName) {
      return `${staff.firstName} ${staff.lastName}`;
    }
    return staff.email || 'N/A';
  };

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

