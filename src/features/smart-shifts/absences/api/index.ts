import { axiosInstance } from '../../common/api/axios';
import { api } from '../../common/constants/api';
import { buildPaginationParams } from '../../common/utils/pagination';
import type {
  Absence,
  CreateAbsenceRequest,
  UpdateAbsenceRequest,
  ApproveAbsenceRequest,
  AbsenceStats,
  AbsenceFilters,
  PaginatedAbsencesResponse,
} from '../types';

export const absencesApi = {
  getAll: async (venueId: string, filters?: AbsenceFilters): Promise<Absence[]> => {
    const params = new URLSearchParams();
    if (filters?.staffId) params.append('staffId', filters.staffId);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);
    if (filters?.approved !== undefined) params.append('approved', String(filters.approved));
    if (filters?.absenceCode) params.append('absenceCode', filters.absenceCode);

    const url = `${api.absences.list(venueId)}?${params.toString()}`;
    const response = await axiosInstance.get(url);
    return response.data;
  },

  getPaginated: async (
    venueId: string,
    page = 1,
    limit = 20,
    filters?: AbsenceFilters
  ): Promise<PaginatedAbsencesResponse> => {
    const params = buildPaginationParams(page, limit, filters);
    const response = await axiosInstance.get(`${api.absences.list(venueId)}?${params.toString()}`);
    return response.data;
  },

  getById: async (venueId: string, id: string): Promise<Absence> => {
    const response = await axiosInstance.get(api.absences.byId(venueId, id));
    return response.data;
  },

  create: async (venueId: string, data: CreateAbsenceRequest): Promise<Absence> => {
    const response = await axiosInstance.post(api.absences.create(venueId), data);
    return response.data;
  },

  update: async (venueId: string, id: string, data: UpdateAbsenceRequest): Promise<Absence> => {
    const response = await axiosInstance.patch(api.absences.update(venueId, id), data);
    return response.data;
  },

  delete: async (venueId: string, id: string): Promise<void> => {
    await axiosInstance.delete(api.absences.delete(venueId, id));
  },

  approve: async (venueId: string, id: string, data?: ApproveAbsenceRequest): Promise<Absence> => {
    const response = await axiosInstance.patch(api.absences.approve(venueId, id), data || {});
    return response.data;
  },

  reject: async (venueId: string, id: string, data?: ApproveAbsenceRequest): Promise<Absence> => {
    const response = await axiosInstance.patch(api.absences.reject(venueId, id), data || {});
    return response.data;
  },

  getStats: async (venueId: string, filters?: { startDate?: string; endDate?: string }): Promise<AbsenceStats> => {
    const params = new URLSearchParams();
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const url = `${api.absences.stats(venueId)}?${params.toString()}`;
    const response = await axiosInstance.get(url);
    return response.data;
  },
};

