'use client';

import React, { useState } from 'react';
import { useVenueSelection } from '@/features/smart-shifts/ai-scheduler/hooks/useVenueSelection';
import { useStaff } from '@/features/smart-shifts/staff/hooks/useStaff';
import { PageHeader } from '@/components/dashboard/layout';
import { EmptyState, LoadingState, VenueSelector as VenueSelectorComponent, Select } from '@/components/dashboard/ui';
import { EmployeeBalanceView } from '@/features/smart-shifts/time-bank/components';
import pageLayout from '@/styles/page-layout.module.css';
import styles from './time-bank.module.css';

export default function TimeBankPage() {
  const { venues, selectedVenueId, setSelectedVenueId } = useVenueSelection();
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');

  // Fetch staff list for the selected venue
  const { data: staffData, isLoading: isLoadingStaff } = useStaff(
    selectedVenueId || '',
    1,
    100
  );
  const staffList = staffData?.data || [];

  const getFullName = (staff: typeof staffList[0]) => {
    if (staff.firstName && staff.lastName) {
      return `${staff.firstName} ${staff.lastName}`;
    }
    return staff.firstName || staff.lastName || staff.email;
  };

  // If no venue selected, show venue selector
  if (!selectedVenueId) {
    return (
      <div className={pageLayout.pageContainer}>
        <PageHeader
          title="Banca Ore"
          subtitle="Visualizza saldi e movimenti (solo visivi)"
        />
        <VenueSelectorComponent
          venues={venues.map((v) => ({
            ...v,
            address: v.address || '',
          }))}
          selectedVenueId={selectedVenueId}
          onVenueChange={setSelectedVenueId}
        />
      </div>
    );
  }

  return (
    <div className={pageLayout.pageContainer}>
      <PageHeader
        title="Banca Ore"
        subtitle="Visualizza saldi ferie, ROL e banca ore (solo visivi)"
        showVenueSelector
        venues={venues}
        selectedVenueId={selectedVenueId}
        onVenueChange={setSelectedVenueId}
      />

      <div className={styles.content}>
        {/* Staff Selector */}
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

        {/* Content */}
        {isLoadingStaff ? (
          <LoadingState message="Caricamento dipendenti..." />
        ) : !selectedStaffId ? (
          <EmptyState
            title="Seleziona un dipendente"
            description="Scegli un dipendente dal menu sopra per visualizzare il saldo della banca ore."
          />
        ) : (
          <EmployeeBalanceView
            staffId={selectedStaffId}
            staffName={
              getFullName(
                staffList.find((s) => s.id === selectedStaffId)!
              ) || 'Dipendente'
            }
          />
        )}
      </div>
    </div>
  );
}

