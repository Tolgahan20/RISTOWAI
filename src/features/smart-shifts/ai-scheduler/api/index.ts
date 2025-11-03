import { axiosInstance } from '../../common/api/axios';
import { api } from '../../common/constants/api';
import type {
  GenerateScheduleRequest,
  ScheduleResponse,
  PublishScheduleRequest,
  StartJobResponse,
  JobStatusResponse,
} from '../types';

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

export const aiSchedulerApi = {
  generateSchedule,
  generateScheduleAsync,
  getJobStatus,
  publishSchedule,
};

