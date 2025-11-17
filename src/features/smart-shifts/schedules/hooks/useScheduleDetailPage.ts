import { useScheduleDetail } from './useScheduleDetail';
import {
  formatFullDate,
  formatTime,
  calculateDuration,
} from '@/features/smart-shifts/common/utils/dateHelpers';
import {
  getStatusColor,
  getStatusLabel,
} from '@/features/smart-shifts/schedules/utils';

export const useScheduleDetailPage = (venueId: string, scheduleId: string) => {
  const { data: schedule, isLoading, isError, refetch } = useScheduleDetail(venueId, scheduleId);

  // Calculate aggregated data
  const shiftsByDate = schedule?.shifts.reduce((acc, shift) => {
    const date = new Date(shift.startTime).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(shift);
    return acc;
  }, {} as Record<string, typeof schedule.shifts>) || {};

  const sortedDates = Object.keys(shiftsByDate).sort();

  const totalHours = schedule?.shifts.reduce((sum, shift) => {
    return sum + parseFloat(calculateDuration(shift.startTime, shift.endTime));
  }, 0) || 0;

  const uniqueStaff = schedule ? new Set(schedule.shifts.map((s) => s.staffId)).size : 0;

  return {
    schedule,
    isLoading,
    isError,
    refetch,
    formatDate: formatFullDate,
    formatTime,
    calculateDuration,
    getStatusColor,
    getStatusLabel,
    shiftsByDate,
    sortedDates,
    totalHours,
    uniqueStaff,
  };
};

