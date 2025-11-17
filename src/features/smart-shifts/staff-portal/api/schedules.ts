import axios from 'axios';
import type { StaffSchedule } from '../../schedules/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

/**
 * Staff portal API for schedules (uses personal token, no JWT auth)
 */
export const staffSchedulesApi = {
  /**
   * Get schedule for staff by personal token
   * Public endpoint - no authentication required
   */
  getScheduleByToken: async (token: string): Promise<StaffSchedule> => {
    const response = await axios.get<StaffSchedule>(
      `${API_URL}/staff-schedules/token/${token}`
    );
    return response.data;
  },
};

