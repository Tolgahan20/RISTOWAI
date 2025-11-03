import { axiosInstance } from '../../common/api/axios';
import { api } from '../../common/constants/api';
import type { Schedule, WeeklySchedule, StaffSchedule } from '../types';

/**
 * Get all schedules for a venue
 */
export const getSchedules = async (venueId: string): Promise<Schedule[]> => {
  const response = await axiosInstance.get(api.schedules.list(venueId));
  return response.data;
};

/**
 * Get a specific schedule by ID
 */
export const getScheduleById = async (
  venueId: string,
  scheduleId: string,
): Promise<Schedule> => {
  const response = await axiosInstance.get(api.schedules.byId(venueId, scheduleId));
  return response.data;
};

/**
 * Get weekly schedule view
 */
export const getWeeklySchedule = async (
  venueId: string,
  startDate: string,
): Promise<WeeklySchedule> => {
  const response = await axiosInstance.get(api.schedules.weekly(venueId, startDate));
  return response.data;
};

/**
 * Get staff schedule
 */
export const getStaffSchedule = async (staffId: string): Promise<StaffSchedule> => {
  const response = await axiosInstance.get(api.schedules.byStaff(staffId));
  return response.data;
};

export const schedulesApi = {
  getSchedules,
  getScheduleById,
  getWeeklySchedule,
  getStaffSchedule,
};

