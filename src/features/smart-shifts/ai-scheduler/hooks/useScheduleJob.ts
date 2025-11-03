import { useQuery, useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import { aiSchedulerApi } from '../api';
import type { GenerateScheduleRequest, ScheduleResponse } from '../types';

const JOB_STORAGE_KEY = 'ristowai_schedule_job_id';
const POLL_INTERVAL = 3000; // 3 seconds

interface UseScheduleJobOptions {
  onComplete?: (result: ScheduleResponse) => void;
  onError?: (error: string) => void;
}

export const useScheduleJob = (options?: UseScheduleJobOptions) => {
  const [jobId, setJobId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(JOB_STORAGE_KEY);
    }
    return null;
  });

  // Use refs to avoid effect dependencies issues
  const onCompleteRef = useRef(options?.onComplete);
  const onErrorRef = useRef(options?.onError);

  useEffect(() => {
    onCompleteRef.current = options?.onComplete;
    onErrorRef.current = options?.onError;
  }, [options?.onComplete, options?.onError]);

  // Start job mutation
  const startJobMutation = useMutation({
    mutationFn: (data: GenerateScheduleRequest) =>
      aiSchedulerApi.generateScheduleAsync(data),
    onSuccess: (response) => {
      setJobId(response.jobId);
      localStorage.setItem(JOB_STORAGE_KEY, response.jobId);
    },
    onError: (error: unknown) => {
      const errorMessage =
        (error as { response?: { data?: { message?: string } } }).response?.data?.message || 
        'Errore durante l\'avvio della generazione';
      onErrorRef.current?.(errorMessage);
    },
  });

  // Poll job status
  const { data: jobStatus } = useQuery({
    queryKey: ['scheduleJob', jobId],
    queryFn: () => aiSchedulerApi.getJobStatus(jobId!),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      // Stop polling if completed or failed
      if (status === 'COMPLETED' || status === 'FAILED') {
        return false;
      }
      return POLL_INTERVAL;
    },
  });

  // Handle job completion
  useEffect(() => {
    if (!jobStatus) return;

    if (jobStatus.status === 'COMPLETED' && jobStatus.result) {
      // Use a microtask to avoid setState during render
      Promise.resolve().then(() => {
        localStorage.removeItem(JOB_STORAGE_KEY);
        setJobId(null);
        onCompleteRef.current?.(jobStatus.result as unknown as ScheduleResponse);
      });
    } else if (jobStatus.status === 'FAILED') {
      Promise.resolve().then(() => {
        localStorage.removeItem(JOB_STORAGE_KEY);
        setJobId(null);
        const errorMessage = jobStatus.error?.message || 'Generazione fallita';
        onErrorRef.current?.(errorMessage);
      });
    }
  }, [jobStatus]);

  // Clear job manually
  const clearJob = useCallback(() => {
    localStorage.removeItem(JOB_STORAGE_KEY);
    setJobId(null);
  }, []);

  return {
    startJob: startJobMutation.mutate,
    isStarting: startJobMutation.isPending,
    jobId,
    jobStatus: jobStatus?.status,
    isPolling: !!jobId && (jobStatus?.status === 'PENDING' || jobStatus?.status === 'PROCESSING'),
    result: jobStatus?.result,
    error: jobStatus?.error,
    clearJob,
  };
};

