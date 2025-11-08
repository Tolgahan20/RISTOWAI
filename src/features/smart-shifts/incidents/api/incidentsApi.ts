import { axiosInstance } from '../../common/api/axios';
import { api } from '../../common/constants/api';
import type {
  Incident,
  CreateIncidentRequest,
  UpdateIncidentRequest,
  ResolveIncidentRequest,
  PaginatedIncidentsQuery,
  PaginatedIncidentsResponse,
  IncidentStats,
} from '../types';

export const incidentsApi = {
  /**
   * Get all incidents with pagination and filters
   */
  getIncidents: async (
    query: PaginatedIncidentsQuery,
  ): Promise<PaginatedIncidentsResponse> => {
    const response = await axiosInstance.get<PaginatedIncidentsResponse>(
      api.incidents.list,
      {
        params: query,
      },
    );
    return response.data;
  },

  /**
   * Get incident by ID
   */
  getIncident: async (id: string): Promise<Incident> => {
    const response = await axiosInstance.get<Incident>(
      api.incidents.getById(id),
    );
    return response.data;
  },

  /**
   * Create a new incident
   */
  createIncident: async (data: CreateIncidentRequest): Promise<Incident> => {
    const response = await axiosInstance.post<Incident>(
      api.incidents.create,
      data,
    );
    return response.data;
  },

  /**
   * Update an incident
   */
  updateIncident: async (
    id: string,
    data: UpdateIncidentRequest,
  ): Promise<Incident> => {
    const response = await axiosInstance.patch<Incident>(
      api.incidents.update(id),
      data,
    );
    return response.data;
  },

  /**
   * Resolve an incident
   */
  resolveIncident: async (
    id: string,
    data: ResolveIncidentRequest,
  ): Promise<Incident> => {
    const response = await axiosInstance.post<Incident>(
      api.incidents.resolve(id),
      data,
    );
    return response.data;
  },

  /**
   * Close an incident
   */
  closeIncident: async (id: string): Promise<Incident> => {
    const response = await axiosInstance.post<Incident>(
      api.incidents.close(id),
      {},
    );
    return response.data;
  },

  /**
   * Delete an incident
   */
  deleteIncident: async (id: string): Promise<void> => {
    await axiosInstance.delete(api.incidents.delete(id));
  },

  /**
   * Get incident statistics
   */
  getStats: async (
    venueId: string,
    startDate?: string,
    endDate?: string,
  ): Promise<IncidentStats> => {
    const response = await axiosInstance.get<IncidentStats>(
      api.incidents.stats,
      {
        params: { venueId, startDate, endDate },
      },
    );
    return response.data;
  },
};

