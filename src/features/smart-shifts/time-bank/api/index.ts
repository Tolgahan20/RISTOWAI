import { axiosInstance } from '../../common/api/axios';
import { api } from '../../common/constants/api';
import type {
  BalancePolicy,
  CreateBalancePolicyRequest,
  UpdateBalancePolicyRequest,
  EmployeeBalance,
  ManualAdjustment,
  CreateManualAdjustmentRequest,
  BalanceWarning,
  RecalculateBalanceRequest,
  BankBucket,
} from '../types';

export const timeBankApi = {
  // Balance Policies
  policy: {
    create: async (data: CreateBalancePolicyRequest): Promise<BalancePolicy> => {
      const response = await axiosInstance.post(api.timeBank.policy.create, data);
      return response.data;
    },

    getByVenue: async (venueId: string): Promise<BalancePolicy | null> => {
      const response = await axiosInstance.get(api.timeBank.policy.byVenue(venueId));
      return response.data;
    },

    getById: async (id: string): Promise<BalancePolicy> => {
      const response = await axiosInstance.get(api.timeBank.policy.byId(id));
      return response.data;
    },

    update: async (id: string, data: UpdateBalancePolicyRequest): Promise<BalancePolicy> => {
      const response = await axiosInstance.put(api.timeBank.policy.update(id), data);
      return response.data;
    },

    delete: async (id: string): Promise<void> => {
      await axiosInstance.delete(api.timeBank.policy.delete(id));
    },
  },

  // Balances
  balance: {
    get: async (staffId: string, year?: number): Promise<EmployeeBalance | null> => {
      const params = new URLSearchParams({ staffId });
      if (year) params.append('year', year.toString());
      const response = await axiosInstance.get(`${api.timeBank.balance.view}?${params.toString()}`);
      return response.data;
    },

    recalculate: async (data: RecalculateBalanceRequest): Promise<EmployeeBalance> => {
      const response = await axiosInstance.post(api.timeBank.balance.recalculate, data);
      return response.data;
    },

    getWarning: async (
      staffId: string,
      visualizeAs: 'VACATION' | 'ROL' | 'NONE',
      requestedHours: number,
      startDate: string,
    ): Promise<BalanceWarning> => {
      const params = new URLSearchParams({
        staffId,
        visualizeAs,
        requestedHours: requestedHours.toString(),
        startDate,
      });
      const response = await axiosInstance.get(`${api.timeBank.balance.warning}?${params.toString()}`);
      return response.data;
    },
  },

  // Manual Adjustments
  adjustment: {
    create: async (data: CreateManualAdjustmentRequest): Promise<ManualAdjustment> => {
      const response = await axiosInstance.post(api.timeBank.adjustment.create, data);
      return response.data;
    },

    getByStaff: async (staffId: string): Promise<ManualAdjustment[]> => {
      const response = await axiosInstance.get(api.timeBank.adjustment.byStaff(staffId));
      return response.data;
    },

    getByStaffAndBucket: async (
      staffId: string,
      bucket: BankBucket,
    ): Promise<ManualAdjustment[]> => {
      const response = await axiosInstance.get(api.timeBank.adjustment.byStaffAndBucket(staffId, bucket));
      return response.data;
    },

    getByVenue: async (venueId: string): Promise<ManualAdjustment[]> => {
      const response = await axiosInstance.get(api.timeBank.adjustment.byVenue(venueId));
      return response.data;
    },
  },
};

