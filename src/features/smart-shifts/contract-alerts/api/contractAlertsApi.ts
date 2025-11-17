import { axiosInstance } from '../../common/api/axios';
import { api } from '../../common/constants/api';
import type { ContractAlert, ContractAlertCount, AlertStatus } from '@/types/contract-alerts';

/**
 * Get all contract alerts for a venue
 */
export const getVenueAlerts = async (
  venueId: string,
  status?: AlertStatus,
): Promise<ContractAlert[]> => {
  const response = await axiosInstance.get<ContractAlert[]>(
    api.contractAlerts.byVenue(venueId, status),
  );
  return response.data;
};

/**
 * Get pending alerts count for a venue
 */
export const getVenuePendingCount = async (
  venueId: string,
): Promise<number> => {
  const response = await axiosInstance.get<ContractAlertCount>(
    api.contractAlerts.pendingCount(venueId),
  );
  return response.data.count;
};

/**
 * Acknowledge an alert
 */
export const acknowledgeAlert = async (
  alertId: string,
): Promise<ContractAlert> => {
  const response = await axiosInstance.patch<ContractAlert>(
    api.contractAlerts.acknowledge(alertId),
  );
  return response.data;
};

/**
 * Resolve an alert
 */
export const resolveAlert = async (
  alertId: string,
): Promise<ContractAlert> => {
  const response = await axiosInstance.patch<ContractAlert>(
    api.contractAlerts.resolve(alertId),
  );
  return response.data;
};

/**
 * Trigger manual check (for testing)
 */
export const triggerManualCheck = async (): Promise<{
  created: number;
  updated: number;
}> => {
  const response = await axiosInstance.post<{
    created: number;
    updated: number;
  }>(api.contractAlerts.triggerCheck);
  return response.data;
};

