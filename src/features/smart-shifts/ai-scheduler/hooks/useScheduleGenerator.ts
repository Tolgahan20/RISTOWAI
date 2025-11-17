import { useState } from 'react';
import { useNotificationStore } from '@/features/smart-shifts/common/stores/notification';
import { useRestaurantId } from '@/features/auth/hooks/useRestaurantId';
import { useVenueDetail } from '@/features/smart-shifts/venues/hooks';
import { useScheduleForm } from './useScheduleForm';
import { usePublishSchedule } from './usePublishSchedule';
import { useScheduleJob } from './useScheduleJob';
import { AI_SCHEDULER_MESSAGES } from '@/features/smart-shifts/common/constants/messages';
import type {
  ScheduleResponse,
  PublishScheduleRequest,
  ShiftToPublish,
  ScheduleMode,
  GenerateScheduleRequest,
} from '../types';

interface UseScheduleGeneratorProps {
  venueId: string;
}

export function useScheduleGenerator({ venueId }: UseScheduleGeneratorProps) {
  const restaurantId = useRestaurantId() || '';
  const { data: venue } = useVenueDetail(restaurantId, venueId);
  const { showNotification } = useNotificationStore();
  const [showResults, setShowResults] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);
  
  const whatsAppEnabled = venue?.settings?.whatsapp?.enabled || false;

  const { startJob, isStarting, isPolling, jobStatus } =
    useScheduleJob({
      onComplete: (data) => {
        setSchedule(data);
        setShowResults(true);
        showNotification({
          type: 'success',
          message: AI_SCHEDULER_MESSAGES.generateSuccess,
        });
      },
      onError: (error) => {
        showNotification({
          type: 'error',
          message: `${AI_SCHEDULER_MESSAGES.generateError}: ${error}`,
        });
      },
    });

  const { publishSchedule, isPublishing } = usePublishSchedule({
    onSuccess: (data) => {
      showNotification({
        type: 'success',
        message: AI_SCHEDULER_MESSAGES.publishSuccess,
      });
      window.location.href = `/dashboard/smart-shifts/schedules/${venueId}/${data.scheduleId}`;
    },
    onError: (error) => {
      showNotification({
        type: 'error',
        message: `${AI_SCHEDULER_MESSAGES.publishError}: ${error}`,
      });
    },
  });

  const { formData, updateDateRange, updateMode, handleSubmit } = useScheduleForm(
    {
      venueId,
      onSubmit: startJob,
    },
  );

  const handlePublish = (sendWhatsApp: boolean = false) => {
    if (!schedule) return;

    // Transform shifts to publish format
    const shiftsToPublish: ShiftToPublish[] = schedule.shifts.map((shift) => ({
      staffId: shift.staffId,
      phaseId: shift.phaseId,
      startTime: shift.startTime,
      endTime: shift.endTime,
    }));

    // Use form data dates (which are the original request dates)
    const publishRequest: PublishScheduleRequest = {
      venueId,
      startDate: formData.dateRange.startDate,
      endDate: formData.dateRange.endDate,
      shifts: shiftsToPublish,
      aiReasoning: schedule.metadata.aiReasoning,
      aiMode: schedule.metadata.mode,
      sendWhatsApp,
    };

    publishSchedule(publishRequest);
  };

  const handleBack = () => {
    setShowResults(false);
  };

  // New handler for wizard-based submission
  const handleSubmitWithData = (data: {
    dateRange: { startDate: string; endDate: string };
    mode: ScheduleMode;
    staffIds?: string[];
    phaseIds?: string[];
    phaseOverrides?: Array<{ phaseId: string; requiredStaff: number }>;
  }) => {
    // Build request with all wizard data
    const request: GenerateScheduleRequest = {
      venueId,
      dateRange: data.dateRange,
      mode: data.mode,
      manualSeeds: undefined,
    };

    // Only include staffIds if user selected specific staff
    if (data.staffIds && data.staffIds.length > 0) {
      request.staffIds = data.staffIds;
    }

    // Only include phaseIds if user selected specific phases
    if (data.phaseIds && data.phaseIds.length > 0) {
      request.phaseIds = data.phaseIds;
    }

    // Include phase overrides if any were set
    if (data.phaseOverrides && data.phaseOverrides.length > 0) {
      request.phaseOverrides = data.phaseOverrides;
    }

    startJob(request);
  };

  return {
    // State
    showResults,
    schedule,
    formData,
    whatsAppEnabled,
    
    // Loading states
    isStarting,
    isPolling,
    isPublishing,
    jobStatus,
    
    // Actions
    updateDateRange,
    updateMode,
    handleSubmit,
    handleSubmitWithData,
    handlePublish,
    handleBack,
  };
}

