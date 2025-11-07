import { axiosInstance } from '../../common/api/axios';
import { api } from '../../common/constants/api';
import { buildPaginationParams } from '../../common/utils/pagination';
import type { 
  Staff, 
  CreateStaffRequest, 
  UpdateStaffRequest, 
  PaginatedStaffResponse,
  StaffFilters 
} from '../types';

/**
 * Get paginated staff for a venue with filters
 */
export const getStaff = async (
  venueId: string,
  page = 1,
  limit = 20,
  filters?: StaffFilters
): Promise<PaginatedStaffResponse> => {
  const params = buildPaginationParams(page, limit, filters);
  const response = await axiosInstance.get(`${api.staff.list(venueId)}?${params.toString()}`);
  return response.data;
};

/**
 * Get a specific staff member by ID
 */
export const getStaffById = async (venueId: string, staffId: string): Promise<Staff> => {
  const response = await axiosInstance.get(api.staff.byId(venueId, staffId));
  return response.data;
};

/**
 * Create a new staff member
 */
export const createStaff = async (venueId: string, data: CreateStaffRequest): Promise<Staff> => {
  const response = await axiosInstance.post(api.staff.create(venueId), data);
  return response.data;
};

/**
 * Update a staff member
 */
export const updateStaff = async (
  venueId: string,
  staffId: string,
  data: UpdateStaffRequest
): Promise<Staff> => {
  const response = await axiosInstance.patch(api.staff.byId(venueId, staffId), data);
  return response.data;
};

/**
 * Delete a staff member
 */
export const deleteStaff = async (venueId: string, staffId: string): Promise<void> => {
  await axiosInstance.delete(api.staff.byId(venueId, staffId));
};

/**
 * Get staff statistics
 */
export const getStaffStats = async (venueId: string): Promise<{
  total: number;
  active: number;
  byRole: { [role: string]: number };
  byContractType: { [type: string]: number };
}> => {
  const response = await axiosInstance.get(api.staff.stats(venueId));
  return response.data;
};

/**
 * Get staff by role
 */
export const getStaffByRole = async (venueId: string, role: string): Promise<Staff[]> => {
  const response = await axiosInstance.get(`${api.staff.byRole(venueId, role)}`);
  return response.data;
};

/**
 * Get staff by contract type
 */
export const getStaffByContract = async (venueId: string, contractType: string): Promise<Staff[]> => {
  const response = await axiosInstance.get(`${api.staff.byContract(venueId, contractType)}`);
  return response.data;
};

export const staffApi = {
  getStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
  getStaffStats,
  getStaffByRole,
  getStaffByContract,
};

