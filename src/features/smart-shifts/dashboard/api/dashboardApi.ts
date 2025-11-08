import { axiosInstance } from '../../common/api/axios';
import { api } from '../../common/constants/api';
import type { DashboardKpis, GetDashboardKpisParams } from '../types';

export const dashboardApi = {
  /**
   * Get dashboard KPIs
   */
  getKpis: async (params: GetDashboardKpisParams): Promise<DashboardKpis> => {
    const response = await axiosInstance.get<DashboardKpis>(api.dashboard.kpis, {
      params,
    });
    return response.data;
  },
};

