import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotificationStore } from '@/features/smart-shifts/common/stores/notification';
import { useScheduleForm } from './useScheduleForm';
import { usePublishSchedule } from './usePublishSchedule';
import { useScheduleJob } from './useScheduleJob';
import { AI_SCHEDULER_MESSAGES } from '@/features/smart-shifts/common/constants/messages';
import type {
  ScheduleResponse,
  PublishScheduleRequest,
  ShiftToPublish,
} from '../types';

interface UseScheduleGeneratorProps {
  venueId: string;
}

export function useScheduleGenerator({ venueId }: UseScheduleGeneratorProps) {
  const router = useRouter();
  const { showNotification } = useNotificationStore();
  const [showResults, setShowResults] = useState(false);
  const [schedule, setSchedule] = useState<ScheduleResponse | null>(null);

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
      router.push(`/dashboard/schedules?scheduleId=${data.scheduleId}`);
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

  const handlePublish = () => {
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
    };

    publishSchedule(publishRequest);
  };

  const handleBack = () => {
    setShowResults(false);
  };

  return {
    // State
    showResults,
    schedule,
    formData,
    
    // Loading states
    isStarting,
    isPolling,
    isPublishing,
    jobStatus,
    
    // Actions
    updateDateRange,
    updateMode,
    handleSubmit,
    handlePublish,
    handleBack,
  };
}

