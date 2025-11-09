import { axiosInstance } from '../../common/api/axios';
import { api } from '../../common/constants/api';
import type { FairnessStats, GetFairnessStatsParams } from '../types';

export const fairnessApi = {
  /**
   * Get fairness statistics for a venue
   */
  getFairnessStats: async (
    params: GetFairnessStatsParams,
  ): Promise<FairnessStats> => {
    const response = await axiosInstance.get<FairnessStats>(
      api.fairRotation.stats(params.venueId),
      {
        params: {
          startDate: params.startDate,
          endDate: params.endDate,
        },
      },
    );
    return response.data;
  },
};

