import { useQuery } from '@tanstack/react-query';
import { staffApi } from '../api';
import type { StaffFilters } from '../types';

export const useStaff = (
  venueId: string,
  page = 1,
  limit = 20,
  filters?: StaffFilters
) => {
  return useQuery({
    queryKey: ['staff', venueId, page, limit, filters],
    queryFn: () => staffApi.getStaff(venueId, page, limit, filters),
    enabled: !!venueId,
  });
};

export const useStaffById = (venueId: string, staffId: string) => {
  return useQuery({
    queryKey: ['staff', venueId, staffId],
    queryFn: () => staffApi.getStaffById(venueId, staffId),
    enabled: !!venueId && !!staffId,
  });
};

export const useStaffStats = (venueId: string) => {
  return useQuery({
    queryKey: ['staff', venueId, 'stats'],
    queryFn: () => staffApi.getStaffStats(venueId),
    enabled: !!venueId,
  });
};

export const useStaffByRole = (venueId: string, role: string) => {
  return useQuery({
    queryKey: ['staff', venueId, 'by-role', role],
    queryFn: () => staffApi.getStaffByRole(venueId, role),
    enabled: !!venueId && !!role,
  });
};

export const useStaffByContract = (venueId: string, contractType: string) => {
  return useQuery({
    queryKey: ['staff', venueId, 'by-contract', contractType],
    queryFn: () => staffApi.getStaffByContract(venueId, contractType),
    enabled: !!venueId && !!contractType,
  });
};

