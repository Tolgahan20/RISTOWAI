import { axiosInstance } from '../../common/api/axios';
import { api } from '../../common/constants/api';
import type {
  WeeklyAdminData,
  ResolveAnomalyRequest,
  ApproveExtraHoursRequest,
  LockWeekRequest,
  WeekLock,
} from '../types';

export const weeklyAdminApi = {
  /**
   * Get weekly admin data
   */
  getWeeklyData: async (
    venueId: string,
    weekStartDate: string,
  ): Promise<WeeklyAdminData> => {
    const response = await axiosInstance.get<WeeklyAdminData>(
      api.weeklyAdmin.getData(venueId),
      {
        params: { weekStartDate },
      },
    );
    return response.data;
  },

  /**
   * Resolve an anomaly
   */
  resolveAnomaly: async (
    venueId: string,
    timeEventId: string,
    data: ResolveAnomalyRequest,
  ): Promise<{ message: string }> => {
    const response = await axiosInstance.patch<{ message: string }>(
      api.weeklyAdmin.resolveAnomaly(venueId, timeEventId),
      data,
    );
    return response.data;
  },

  /**
   * Approve extra hours
   */
  approveExtraHours: async (
    venueId: string,
    data: ApproveExtraHoursRequest,
  ): Promise<{ message: string }> => {
    const response = await axiosInstance.post<{ message: string }>(
      api.weeklyAdmin.approveExtraHours(venueId),
      data,
    );
    return response.data;
  },

  /**
   * Lock a week
   */
  lockWeek: async (venueId: string, data: LockWeekRequest): Promise<WeekLock> => {
    const response = await axiosInstance.post<WeekLock>(
      api.weeklyAdmin.lockWeek(venueId),
      data,
    );
    return response.data;
  },

  /**
   * Unlock a week
   */
  unlockWeek: async (venueId: string, weekStartDate: string): Promise<WeekLock> => {
    const response = await axiosInstance.post<WeekLock>(
      api.weeklyAdmin.unlockWeek(venueId),
      {},
      {
        params: { weekStartDate },
      },
    );
    return response.data;
  },
};

