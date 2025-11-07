import { axiosInstance } from '../../common/api/axios';
import { api } from '../../common/constants/api';
import { buildPaginationParams } from '../../common/utils/pagination';
import type { Phase, CreatePhaseRequest, UpdatePhaseRequest, PaginatedPhasesResponse, PhaseFilters } from '../types';

export const phasesApi = {
  getAll: async (venueId: string): Promise<Phase[]> => {
    const response = await axiosInstance.get(`${api.phases.list(venueId)}`);
    return response.data;
  },

  getPaginated: async (
    venueId: string,
    page = 1,
    limit = 20,
    filters?: PhaseFilters
  ): Promise<PaginatedPhasesResponse> => {
    const params = buildPaginationParams(page, limit, filters);
    const response = await axiosInstance.get(`${api.phases.list(venueId)}?${params.toString()}`);
    return response.data;
  },

  getById: async (venueId: string, phaseId: string): Promise<Phase> => {
    const response = await axiosInstance.get(`${api.phases.byId(venueId, phaseId)}`);
    return response.data;
  },

  getStats: async (venueId: string): Promise<unknown> => {
    const response = await axiosInstance.get(`${api.phases.stats(venueId)}`);
    return response.data;
  },

  getOverlaps: async (venueId: string): Promise<unknown> => {
    const response = await axiosInstance.get(`${api.phases.overlaps(venueId)}`);
    return response.data;
  },

  getByType: async (venueId: string, type: string): Promise<Phase[]> => {
    const response = await axiosInstance.get(`${api.phases.byType(venueId, type)}`);
    return response.data;
  },

  getByDay: async (venueId: string, day: number): Promise<Phase[]> => {
    const response = await axiosInstance.get(`${api.phases.byDay(venueId, day)}`);
    return response.data;
  },

  create: async (venueId: string, data: CreatePhaseRequest): Promise<Phase> => {
    const response = await axiosInstance.post(`${api.phases.create(venueId)}`, data);
    return response.data;
  },

  update: async (venueId: string, phaseId: string, data: UpdatePhaseRequest): Promise<Phase> => {
    const response = await axiosInstance.patch(`${api.phases.update(venueId, phaseId)}`, data);
    return response.data;
  },

  delete: async (venueId: string, phaseId: string): Promise<void> => {
    await axiosInstance.delete(`${api.phases.delete(venueId, phaseId)}`);
  },
};

