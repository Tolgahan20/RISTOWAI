import { useMutation } from '@tanstack/react-query';
import { aiSchedulerApi } from '../api';
import type { PublishScheduleRequest } from '../types';

interface UsePublishScheduleOptions {
  onSuccess?: (data: { scheduleId: string; message: string }) => void;
  onError?: (error: string) => void;
}

export const usePublishSchedule = (options?: UsePublishScheduleOptions) => {
  const mutation = useMutation({
    mutationFn: (data: PublishScheduleRequest) => aiSchedulerApi.publishSchedule(data),
    onSuccess: (data) => {
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      const errorMessage =
        error.response?.data?.message || 'Errore durante la pubblicazione del turni';
      options?.onError?.(errorMessage);
    },
  });

  return {
    publishSchedule: mutation.mutate,
    isPublishing: mutation.isPending,
    publishedData: mutation.data,
    isSuccess: mutation.isSuccess,
    error: mutation.error,
  };
};

