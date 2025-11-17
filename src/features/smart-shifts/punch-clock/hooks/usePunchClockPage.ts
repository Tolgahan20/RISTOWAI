import { useState } from 'react';
import { useStaff } from '@/features/smart-shifts/staff/hooks/useStaff';

export type Tab = 'clock' | 'history' | 'anomalies';

export const usePunchClockPage = (selectedVenueId: string | null) => {
  const [activeTab, setActiveTab] = useState<Tab>('anomalies'); // Default to anomalies for admins
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');

  // Fetch staff list for the selected venue (for admin staff selection)
  const { data: staffData } = useStaff(selectedVenueId || '', 1, 100);
  const staffList = staffData?.data || [];

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

  return {
    activeTab,
    setActiveTab,
    selectedStaffId,
    setSelectedStaffId,
    staffList,
    getSubtitle,
    getFullName,
  };
};

