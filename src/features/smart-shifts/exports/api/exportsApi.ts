import { axiosInstance } from '../../common/api/axios';
import { api } from '../../common/constants/api';
import type {
  Export,
  CreateExportRequest,
  ValidationResult,
} from '../types';

export const exportsApi = {
  /**
   * Validate export preconditions
   */
  validate: async (request: CreateExportRequest): Promise<ValidationResult> => {
    const response = await axiosInstance.post<ValidationResult>(
      api.exports.validate,
      request,
    );
    return response.data;
  },

  /**
   * Create a new export
   */
  create: async (request: CreateExportRequest): Promise<Export> => {
    const response = await axiosInstance.post<Export>(api.exports.create, request);
    return response.data;
  },

  /**
   * Get all exports for a venue
   */
  getByVenue: async (venueId: string): Promise<Export[]> => {
    const response = await axiosInstance.get<Export[]>(api.exports.byVenue(venueId));
    return response.data;
  },

  /**
   * Get export by ID
   */
  getById: async (exportId: string): Promise<Export> => {
    const response = await axiosInstance.get<Export>(api.exports.byId(exportId));
    return response.data;
  },

  /**
   * Download export as CSV
   */
  download: async (exportId: string): Promise<Blob> => {
    const response = await axiosInstance.get(api.exports.download(exportId), {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Delete an export
   */
  delete: async (exportId: string): Promise<void> => {
    await axiosInstance.delete(api.exports.delete(exportId));
  },
};

