import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboardApi';
import type { GetDashboardKpisParams } from '../types';

export const useDashboardKpis = (params: GetDashboardKpisParams) => {
  return useQuery({
    queryKey: ['dashboardKpis', params.venueId, params.startDate, params.endDate],
    queryFn: () => dashboardApi.getKpis(params),
    enabled: !!params.venueId,
  });
};

