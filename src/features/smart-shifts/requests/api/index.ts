import { axiosInstance } from '../../common/api/axios';
import { api } from '../../common/constants/api';
import { buildPaginationParams } from '../../common/utils/pagination';
import type {
  Request,
  CreateRequestRequest,
  UpdateRequestRequest,
  ReviewRequestRequest,
  RequestStats,
  RequestFilters,
  PaginatedRequestsResponse,
} from '../types';

export const requestsApi = {
  getAll: async (venueId: string, filters?: RequestFilters): Promise<Request[]> => {
    const params = new URLSearchParams();
    if (filters?.staffId) params.append('staffId', filters.staffId);
    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.startDate) params.append('startDate', filters.startDate);
    if (filters?.endDate) params.append('endDate', filters.endDate);

    const url = `${api.requests.list(venueId)}?${params.toString()}`;
    const response = await axiosInstance.get(url);
    return response.data;
  },

  getPaginated: async (
    venueId: string,
    page = 1,
    limit = 20,
    filters?: RequestFilters
  ): Promise<PaginatedRequestsResponse> => {
    const params = buildPaginationParams(page, limit, filters);
    const response = await axiosInstance.get(`${api.requests.list(venueId)}?${params.toString()}`);
    return response.data;
  },

  getById: async (venueId: string, id: string): Promise<Request> => {
    const response = await axiosInstance.get(api.requests.byId(venueId, id));
    return response.data;
  },

  create: async (venueId: string, data: CreateRequestRequest): Promise<Request> => {
    const response = await axiosInstance.post(api.requests.create(venueId), data);
    return response.data;
  },

  update: async (venueId: string, id: string, data: UpdateRequestRequest): Promise<Request> => {
    const response = await axiosInstance.patch(api.requests.update(venueId, id), data);
    return response.data;
  },

  delete: async (venueId: string, id: string): Promise<void> => {
    await axiosInstance.delete(api.requests.delete(venueId, id));
  },

  approve: async (venueId: string, id: string, data?: ReviewRequestRequest): Promise<Request> => {
    const response = await axiosInstance.patch(api.requests.approve(venueId, id), data || {});
    return response.data;
  },

  reject: async (venueId: string, id: string, data?: ReviewRequestRequest): Promise<Request> => {
    const response = await axiosInstance.patch(api.requests.reject(venueId, id), data || {});
    return response.data;
  },

  cancel: async (venueId: string, id: string): Promise<Request> => {
    const response = await axiosInstance.patch(api.requests.cancel(venueId, id));
    return response.data;
  },

  getStats: async (venueId: string): Promise<RequestStats> => {
    const response = await axiosInstance.get(api.requests.stats(venueId));
    return response.data;
  },
};

