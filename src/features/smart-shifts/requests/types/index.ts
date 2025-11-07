export enum RequestType {
  TIME_OFF = 'TIME_OFF',
  SHIFT_SWAP = 'SHIFT_SWAP',
  SCHEDULE_CHANGE = 'SCHEDULE_CHANGE',
  EXTRA_SHIFT = 'EXTRA_SHIFT',
  EARLY_LEAVE = 'EARLY_LEAVE',
  LATE_ARRIVAL = 'LATE_ARRIVAL',
}

export enum RequestStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

export enum RequestPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export interface Request {
  id: string;
  venueId: string;
  staffId: string;
  staffName: string;
  type: RequestType;
  status: RequestStatus;
  priority: RequestPriority;
  startDate: string;
  endDate: string;
  reason?: string;
  notes?: string;
  targetShiftId?: string;
  swapWithStaffId?: string;
  swapWithStaffName?: string;
  reviewedBy?: string;
  reviewerName?: string;
  reviewedAt?: string;
  reviewerNotes?: string;
  createdAt: string;
  updatedAt: string;
  durationDays: number;
}

export interface CreateRequestRequest {
  staffId: string;
  type: RequestType;
  priority?: RequestPriority;
  startDate: string;
  endDate: string;
  reason?: string;
  notes?: string;
  targetShiftId?: string;
  swapWithStaffId?: string;
}

export interface UpdateRequestRequest {
  staffId?: string;
  type?: RequestType;
  priority?: RequestPriority;
  startDate?: string;
  endDate?: string;
  reason?: string;
  notes?: string;
  targetShiftId?: string;
  swapWithStaffId?: string;
}

export interface ReviewRequestRequest {
  reviewerNotes?: string;
}

export interface RequestStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  cancelled: number;
  byType: Record<RequestType, number>;
  avgResponseTimeHours: number;
}

// UI helper types
export interface RequestTypeOption {
  value: RequestType;
  label: string;
  icon: string;
  description: string;
}

export interface RequestFilters {
  search?: string;
  staffId?: string;
  status?: RequestStatus;
  type?: RequestType;
  startDate?: string;
  endDate?: string;
}

export type { PaginatedRequestsResponse } from './paginated';

