import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { shiftSnapshotsApi } from '../api';
import type {
  CreateShiftSnapshotRequest,
  UpdateShiftSnapshotRequest,
  PublishSnapshotRequest,
  SnapshotFilters,
} from '../types';

// Query keys
export const snapshotKeys = {
  all: ['shift-snapshots'] as const,
  lists: () => [...snapshotKeys.all, 'list'] as const,
  list: (venueId: string, filters?: SnapshotFilters) =>
    [...snapshotKeys.lists(), venueId, filters] as const,
  details: () => [...snapshotKeys.all, 'detail'] as const,
  detail: (id: string) => [...snapshotKeys.details(), id] as const,
  history: (id: string) => [...snapshotKeys.all, 'history', id] as const,
  staffShifts: (id: string, staffId: string) =>
    [...snapshotKeys.all, 'staff-shifts', id, staffId] as const,
};

/**
 * Hook to fetch paginated snapshots for a venue
 */
export const useShiftSnapshots = (
  venueId: string,
  page: number,
  limit: number,
  filters?: SnapshotFilters
) => {
  return useQuery({
    queryKey: [...snapshotKeys.list(venueId, filters), page, limit],
    queryFn: () => shiftSnapshotsApi.getPaginated(venueId, page, limit, filters),
    enabled: !!venueId,
  });
};

/**
 * Hook to fetch a single snapshot by ID
 */
export const useShiftSnapshot = (id: string) => {
  return useQuery({
    queryKey: snapshotKeys.detail(id),
    queryFn: () => shiftSnapshotsApi.getById(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch version history for a snapshot
 */
export const useSnapshotHistory = (id: string) => {
  return useQuery({
    queryKey: snapshotKeys.history(id),
    queryFn: () => shiftSnapshotsApi.getHistory(id),
    enabled: !!id,
  });
};

/**
 * Hook to fetch staff shifts from a snapshot
 */
export const useSnapshotStaffShifts = (id: string, staffId: string) => {
  return useQuery({
    queryKey: snapshotKeys.staffShifts(id, staffId),
    queryFn: () => shiftSnapshotsApi.getStaffShifts(id, staffId),
    enabled: !!id && !!staffId,
  });
};

/**
 * Hook for snapshot mutations (create, update, delete, etc.)
 */
export const useShiftSnapshotMutations = (venueId?: string) => {
  const queryClient = useQueryClient();

  const createSnapshot = useMutation({
    mutationFn: (data: CreateShiftSnapshotRequest) =>
      shiftSnapshotsApi.create(data),
    onSuccess: () => {
      if (venueId) {
        queryClient.invalidateQueries({ queryKey: snapshotKeys.list(venueId) });
      }
      queryClient.invalidateQueries({ queryKey: snapshotKeys.lists() });
    },
  });

  const updateSnapshot = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateShiftSnapshotRequest }) =>
      shiftSnapshotsApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: snapshotKeys.detail(variables.id) });
      if (venueId) {
        queryClient.invalidateQueries({ queryKey: snapshotKeys.list(venueId) });
      }
      queryClient.invalidateQueries({ queryKey: snapshotKeys.lists() });
    },
  });

  const publishSnapshot = useMutation({
    mutationFn: ({ id, data }: { id: string; data: PublishSnapshotRequest }) =>
      shiftSnapshotsApi.publish(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: snapshotKeys.detail(variables.id) });
      if (venueId) {
        queryClient.invalidateQueries({ queryKey: snapshotKeys.list(venueId) });
      }
      queryClient.invalidateQueries({ queryKey: snapshotKeys.lists() });
    },
  });

  const lockSnapshot = useMutation({
    mutationFn: (id: string) => shiftSnapshotsApi.lock(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: snapshotKeys.detail(id) });
      if (venueId) {
        queryClient.invalidateQueries({ queryKey: snapshotKeys.list(venueId) });
      }
      queryClient.invalidateQueries({ queryKey: snapshotKeys.lists() });
    },
  });

  const archiveSnapshot = useMutation({
    mutationFn: (id: string) => shiftSnapshotsApi.archive(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: snapshotKeys.detail(id) });
      if (venueId) {
        queryClient.invalidateQueries({ queryKey: snapshotKeys.list(venueId) });
      }
      queryClient.invalidateQueries({ queryKey: snapshotKeys.lists() });
    },
  });

  const deleteSnapshot = useMutation({
    mutationFn: (id: string) => shiftSnapshotsApi.delete(id),
    onSuccess: () => {
      if (venueId) {
        queryClient.invalidateQueries({ queryKey: snapshotKeys.list(venueId) });
      }
      queryClient.invalidateQueries({ queryKey: snapshotKeys.lists() });
    },
  });

  return {
    createSnapshot,
    updateSnapshot,
    publishSnapshot,
    lockSnapshot,
    archiveSnapshot,
    deleteSnapshot,
  };
};

