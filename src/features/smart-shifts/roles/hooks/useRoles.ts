import { useQuery } from '@tanstack/react-query';
import { rolesApi } from '../api';
import type { RoleFilters } from '../types';

export const useRoles = () => {
  return useQuery({
    queryKey: ['roles'],
    queryFn: () => rolesApi.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes - roles don't change often
  });
};

export const useRolesPaginated = (
  page: number,
  limit: number,
  filters?: RoleFilters
) => {
  return useQuery({
    queryKey: ['roles', 'paginated', page, limit, filters],
    queryFn: () => rolesApi.getPaginated(page, limit, filters),
    staleTime: 5 * 60 * 1000, // 5 minutes - roles don't change often
  });
};

