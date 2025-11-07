import { axiosInstance } from '../../common/api/axios';
import { api } from '../../common/constants/api';
import type {
  GenerateScheduleRequest,
  ScheduleResponse,
  PublishScheduleRequest,
  StartJobResponse,
  JobStatusResponse,
} from '../types';
import type {
  CheckAvailabilityRequest,
  AvailabilityResponse,
} from '../types/availability';

/**
 * Generate AI-powered schedule (synchronous)
 */
export const generateSchedule = async (
  data: GenerateScheduleRequest,
): Promise<ScheduleResponse> => {
  const response = await axiosInstance.post(api.aiScheduler.generate, data);
  return response.data;
};

/**
 * Start AI schedule generation in background
 */
export const generateScheduleAsync = async (
  data: GenerateScheduleRequest,
): Promise<StartJobResponse> => {
  const response = await axiosInstance.post(api.aiScheduler.generateAsync, data);
  return response.data;
};

/**
 * Get job status
 */
export const getJobStatus = async (jobId: string): Promise<JobStatusResponse> => {
  const response = await axiosInstance.get(api.aiScheduler.job(jobId));
  return response.data;
};

/**
 * Publish AI-generated schedule to database
 */
export const publishSchedule = async (
  data: PublishScheduleRequest,
): Promise<{ scheduleId: string; message: string }> => {
  const response = await axiosInstance.post(api.aiScheduler.publish, data);
  return response.data;
};

/**
 * Get user's job history
 */
export const getMyJobs = async (filters?: {
  limit?: number;
  status?: string;
  venueId?: string;
  startDate?: string;
  endDate?: string;
}): Promise<JobStatusResponse[]> => {
  const params = new URLSearchParams();
  
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.status) params.append('status', filters.status);
  if (filters?.venueId) params.append('venueId', filters.venueId);
  if (filters?.startDate) params.append('startDate', filters.startDate);
  if (filters?.endDate) params.append('endDate', filters.endDate);

  const url = params.toString() ? `${api.aiScheduler.myJobs}?${params.toString()}` : api.aiScheduler.myJobs;
  const response = await axiosInstance.get(url);
  return response.data;
};

/**
 * Check staff availability for a date range
 */
export const checkAvailability = async (
  data: CheckAvailabilityRequest,
): Promise<AvailabilityResponse> => {
  const response = await axiosInstance.post(api.aiScheduler.checkAvailability, data);
  return response.data;
};

export const aiSchedulerApi = {
  generateSchedule,
  generateScheduleAsync,
  getJobStatus,
  publishSchedule,
  getMyJobs,
  checkAvailability,
};

