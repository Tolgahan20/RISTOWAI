import { axiosInstance } from '../../common/api/axios';
import { api } from '../../common/constants/api';

import { buildPaginationParams } from '../../common/utils/pagination';
import type {
  ShiftSnapshot,
  CreateShiftSnapshotRequest,
  UpdateShiftSnapshotRequest,
  PublishSnapshotRequest,
  SnapshotFilters,
  ShiftSnapshotData,
} from '../types';
import type { PaginatedSnapshotsResponse } from '../types/paginated';

export const shiftSnapshotsApi = {
  /**
   * Get paginated list of snapshots for a venue
   */
  getPaginated: async (
    venueId: string,
    page = 1,
    limit = 20,
    filters?: SnapshotFilters
  ): Promise<PaginatedSnapshotsResponse> => {
    const params = buildPaginationParams(page, limit, filters);
    const response = await axiosInstance.get(
      `${api.shiftSnapshots.list(venueId)}?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get a single snapshot by ID
   */
  getById: async (id: string): Promise<ShiftSnapshot> => {
    const response = await axiosInstance.get(api.shiftSnapshots.byId(id));
    return response.data;
  },

  /**
   * Get version history for a snapshot
   */
  getHistory: async (id: string): Promise<ShiftSnapshot[]> => {
    const response = await axiosInstance.get(api.shiftSnapshots.history(id));
    return response.data;
  },

  /**
   * Get shifts for a specific staff member
   */
  getStaffShifts: async (id: string, staffId: string): Promise<ShiftSnapshotData[]> => {
    const response = await axiosInstance.get(
      api.shiftSnapshots.staffShifts(id, staffId)
    );
    return response.data;
  },

  /**
   * Create a new snapshot
   */
  create: async (data: CreateShiftSnapshotRequest): Promise<ShiftSnapshot> => {
    const response = await axiosInstance.post(api.shiftSnapshots.base, data);
    return response.data;
  },

  /**
   * Update a snapshot
   */
  update: async (
    id: string,
    data: UpdateShiftSnapshotRequest
  ): Promise<ShiftSnapshot> => {
    const response = await axiosInstance.put(api.shiftSnapshots.byId(id), data);
    return response.data;
  },

  /**
   * Publish a snapshot
   */
  publish: async (id: string, data: PublishSnapshotRequest): Promise<ShiftSnapshot> => {
    const response = await axiosInstance.post(
      api.shiftSnapshots.publish(id),
      data
    );
    return response.data;
  },

  /**
   * Lock a snapshot
   */
  lock: async (id: string): Promise<ShiftSnapshot> => {
    const response = await axiosInstance.post(api.shiftSnapshots.lock(id));
    return response.data;
  },

  /**
   * Archive a snapshot
   */
  archive: async (id: string): Promise<ShiftSnapshot> => {
    const response = await axiosInstance.post(api.shiftSnapshots.archive(id));
    return response.data;
  },

  /**
   * Delete a snapshot
   */
  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(api.shiftSnapshots.byId(id));
  },
};

