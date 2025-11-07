export enum BankBucket {
  VACATION = 'VACATION',
  ROL = 'ROL',
  BANK = 'BANK',
}

export interface BalancePolicy {
  id: string;
  venueId: string;
  hoursPerDayContract: number;
  vacationAccrualHoursPerMonth: number;
  rolAccrualHoursPerMonth: number;
  carryoverCapVacationHours?: number;
  carryoverCapRolHours?: number;
  projectionExpiryMonth?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBalancePolicyRequest {
  venueId: string;
  hoursPerDayContract?: number;
  vacationAccrualHoursPerMonth?: number;
  rolAccrualHoursPerMonth?: number;
  carryoverCapVacationHours?: number;
  carryoverCapRolHours?: number;
  projectionExpiryMonth?: number;
}

export interface UpdateBalancePolicyRequest {
  hoursPerDayContract?: number;
  vacationAccrualHoursPerMonth?: number;
  rolAccrualHoursPerMonth?: number;
  carryoverCapVacationHours?: number;
  carryoverCapRolHours?: number;
  projectionExpiryMonth?: number;
}

export interface EmployeeBalance {
  staffId: string;
  year: number;
  vacationAccruedH: number;
  vacationTakenH: number;
  vacationBalanceH: number;
  rolAccruedH: number;
  rolTakenH: number;
  rolBalanceH: number;
  bankBalanceH: number;
  projYeVacationH: number;
  projYeRolH: number;
  carryoverCapVacationHours?: number;
  carryoverCapRolHours?: number;
  updatedAt: string;
}

export interface ManualAdjustment {
  id: string;
  staffId: string;
  venueId: string;
  hours: number;
  bucket: BankBucket;
  reason?: string;
  adjustedBy: string;
  createdAt: string;
}

export interface CreateManualAdjustmentRequest {
  staffId: string;
  venueId: string;
  hours: number;
  bucket?: BankBucket;
  reason?: string;
  adjustedBy: string;
}

export interface BalanceWarning {
  hasWarning: boolean;
  currentBalance: number;
  requestedHours: number;
  projectedYearEndBalance: number;
  message?: string;
}

export interface RecalculateBalanceRequest {
  staffId: string;
  year?: number;
}

