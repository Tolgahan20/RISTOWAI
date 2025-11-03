import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { aiSchedulerApi } from '../api';
import type { GenerateScheduleRequest, ScheduleResponse } from '../types';
import { AI_SCHEDULER_MESSAGES } from '../../common/constants/messages';

interface UseAISchedulerProps {
  onSuccess?: (data: ScheduleResponse) => void;
  onError?: (error: string) => void;
}

export const useAIScheduler = ({ onSuccess, onError }: UseAISchedulerProps = {}) => {
  const generateMutation = useMutation({
    mutationFn: (data: GenerateScheduleRequest) =>
      aiSchedulerApi.generateSchedule(data),
    onSuccess: (data) => {
      onSuccess?.(data);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const message = err.response?.data?.message || AI_SCHEDULER_MESSAGES.generateError;
      onError?.(message);
    },
  });

  return {
    generateSchedule: generateMutation.mutate,
    isGenerating: generateMutation.isPending,
    generatedSchedule: generateMutation.data,
    error: generateMutation.error,
    isSuccess: generateMutation.isSuccess,
    reset: generateMutation.reset,
  };
};

