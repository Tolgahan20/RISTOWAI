import { axiosInstance } from '../../common/api/axios';
import type {
  TimeEvent,
  ClockInRequest,
  ClockOutRequest,
  ResolveAnomalyRequest,
} from '../types';

export const punchClockApi = {
  /**
   * Clock in a staff member
   */
  clockIn: async (data: ClockInRequest): Promise<TimeEvent> => {
    const response = await axiosInstance.post('/api/punch/clock-in', data);
    return response.data;
  },

  /**
   * Clock out a staff member
   */
  clockOut: async (data: ClockOutRequest): Promise<TimeEvent> => {
    const response = await axiosInstance.post('/api/punch/clock-out', data);
    return response.data;
  },

  /**
   * Get time events for a staff member
   */
  getTimeEvents: async (
    staffId: string,
    venueId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<TimeEvent[]> => {
    const params = new URLSearchParams({ venueId });
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);

    const response = await axiosInstance.get(
      `/api/punch/time-events/${staffId}?${params.toString()}`,
    );
    return response.data;
  },

  /**
   * Get unresolved anomalies for a venue
   */
  getUnresolvedAnomalies: async (venueId: string): Promise<TimeEvent[]> => {
    const response = await axiosInstance.get(
      `/api/punch/anomalies/${venueId}`,
    );
    return response.data;
  },

  /**
   * Resolve an anomaly (manager action)
   */
  resolveAnomaly: async (
    eventId: string,
    data: ResolveAnomalyRequest,
  ): Promise<TimeEvent> => {
    const response = await axiosInstance.patch(
      `/api/punch/anomalies/${eventId}/resolve`,
      data,
    );
    return response.data;
  },
};

