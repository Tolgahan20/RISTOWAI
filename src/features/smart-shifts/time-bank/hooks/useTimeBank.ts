import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { timeBankApi } from '../api';
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

// Balance Policy Hooks
export const useBalancePolicy = (venueId: string) => {
  return useQuery({
    queryKey: ['balancePolicy', venueId],
    queryFn: () => timeBankApi.policy.getByVenue(venueId),
    enabled: !!venueId,
  });
};

export const useBalancePolicyMutations = () => {
  const queryClient = useQueryClient();

  const createPolicy = useMutation({
    mutationFn: (data: CreateBalancePolicyRequest) => timeBankApi.policy.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['balancePolicy', variables.venueId] });
    },
  });

  const updatePolicy = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateBalancePolicyRequest }) =>
      timeBankApi.policy.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balancePolicy'] });
    },
  });

  const deletePolicy = useMutation({
    mutationFn: (id: string) => timeBankApi.policy.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['balancePolicy'] });
    },
  });

  return {
    createPolicy,
    updatePolicy,
    deletePolicy,
  };
};

// Employee Balance Hooks
export const useEmployeeBalance = (staffId: string, year?: number) => {
  return useQuery({
    queryKey: ['employeeBalance', staffId, year],
    queryFn: () => timeBankApi.balance.get(staffId, year),
    enabled: !!staffId,
  });
};

export const useRecalculateBalance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RecalculateBalanceRequest) => timeBankApi.balance.recalculate(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['employeeBalance', variables.staffId] });
    },
  });
};

export const useBalanceWarning = (
  staffId: string,
  visualizeAs: 'VACATION' | 'ROL' | 'NONE',
  requestedHours: number,
  startDate: string,
  enabled = false,
) => {
  return useQuery({
    queryKey: ['balanceWarning', staffId, visualizeAs, requestedHours, startDate],
    queryFn: () => timeBankApi.balance.getWarning(staffId, visualizeAs, requestedHours, startDate),
    enabled: enabled && !!staffId && !!visualizeAs && visualizeAs !== 'NONE',
  });
};

// Manual Adjustment Hooks
export const useManualAdjustments = (staffId: string) => {
  return useQuery({
    queryKey: ['manualAdjustments', staffId],
    queryFn: () => timeBankApi.adjustment.getByStaff(staffId),
    enabled: !!staffId,
  });
};

export const useManualAdjustmentsByBucket = (staffId: string, bucket: BankBucket) => {
  return useQuery({
    queryKey: ['manualAdjustments', staffId, bucket],
    queryFn: () => timeBankApi.adjustment.getByStaffAndBucket(staffId, bucket),
    enabled: !!staffId && !!bucket,
  });
};

export const useCreateManualAdjustment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateManualAdjustmentRequest) => timeBankApi.adjustment.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['manualAdjustments', variables.staffId] });
      queryClient.invalidateQueries({ queryKey: ['employeeBalance', variables.staffId] });
    },
  });
};

