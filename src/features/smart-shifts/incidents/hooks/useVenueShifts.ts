import { useMemo } from 'react';
import { useShiftSnapshots } from '@/features/smart-shifts/shift-snapshots/hooks/useShiftSnapshots';

export interface ShiftOption {
  id: string;
  staffId: string;
  staffName: string;
  startTime: string;
  endTime: string;
  date: string;
  phaseName?: string;
}

/**
 * Hook to fetch available shifts for a venue from recent snapshots
 * Used for selecting shifts in incident reports
 */
export const useVenueShifts = (venueId: string) => {
  // Fetch recent snapshots (last 90 days to capture more data)
  const today = new Date();
  const ninetyDaysAgo = new Date(today);
  ninetyDaysAgo.setDate(today.getDate() - 90);
  const sixtyDaysFromNow = new Date(today);
  sixtyDaysFromNow.setDate(today.getDate() + 60);

  // Fetch ALL snapshots (not just published) to get more data
  const { data: snapshotsData, isLoading, error } = useShiftSnapshots(venueId, 1, 50, {
    startDateFrom: ninetyDaysAgo.toISOString().split('T')[0],
    startDateTo: sixtyDaysFromNow.toISOString().split('T')[0],
    // Removed status filter to get ALL snapshots (DRAFT, PUBLISHED, etc.)
  });

  // Process shifts from snapshots
  const shifts = useMemo(() => {
    const allShifts: ShiftOption[] = [];
    
    if (snapshotsData?.data) {
      snapshotsData.data.forEach((snapshot) => {
        if (snapshot.shiftsJson && Array.isArray(snapshot.shiftsJson)) {
          snapshot.shiftsJson.forEach((shift) => {
            // Extract date from shift start time or use snapshot date
            const shiftDate = shift.startTime?.split('T')[0] || snapshot.snapshotDate;
            
            allShifts.push({
              id: shift.id,
              staffId: shift.staffId,
              staffName: shift.staffName || 'Unknown',
              startTime: shift.startTime,
              endTime: shift.endTime,
              date: shiftDate,
              phaseName: shift.phaseName,
            });
          });
        }
      });
    }

    // Sort by date and time (most recent first)
    allShifts.sort((a, b) => {
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime();
    });

    return allShifts;
  }, [snapshotsData]);

  return {
    data: shifts,
    isLoading,
    error,
  };
};

