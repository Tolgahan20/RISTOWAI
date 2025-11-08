export enum AnomalyType {
  LATE_ARRIVAL = 'LATE_ARRIVAL',
  EARLY_DEPARTURE = 'EARLY_DEPARTURE',
  OVERTIME = 'OVERTIME',
  MISSING_PUNCH = 'MISSING_PUNCH',
  OTHER = 'OTHER',
}

export enum ExtraHoursDisposition {
  PAID = 'PAID',
  BANKED = 'BANKED',
}

export enum WeekLockStatus {
  OPEN = 'OPEN',
  LOCKED = 'LOCKED',
  CLOSED = 'CLOSED',
}

export interface WeeklySummary {
  weekStartDate: string;
  weekEndDate: string;
  totalStaff: number;
  unresolvedAnomalies: number;
  pendingExtraHours: number;
  totalPlannedHours: number;
  totalActualHours: number;
  complianceScore: number;
  isLocked: boolean;
  lockedBy?: string;
  lockedAt?: string;
}

export interface AnomalyItem {
  id: string;
  timeEventId: string;
  staffId: string;
  staffName: string;
  date: string;
  anomalyType: AnomalyType;
  severity: string;
  description: string;
  diffMinutes?: number;
  isResolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface ExtraHoursItem {
  staffId: string;
  staffName: string;
  weekStartDate: string;
  weekEndDate: string;
  plannedHours: number;
  actualHours: number;
  extraHours: number;
  isApproved: boolean;
  disposition?: ExtraHoursDisposition;
  approvedBy?: string;
  approvedAt?: string;
}

export interface WeeklyAdminData {
  summary: WeeklySummary;
  anomalies: AnomalyItem[];
  extraHours: ExtraHoursItem[];
}

export interface ResolveAnomalyRequest {
  resolutionNotes: string;
  approvedHours?: number;
}

export interface ApproveExtraHoursRequest {
  staffId: string;
  weekStartDate: string;
  extraHours: number;
  disposition: ExtraHoursDisposition;
  notes?: string;
}

export interface LockWeekRequest {
  weekStartDate: string;
  notes?: string;
}

export interface WeekLock {
  id: string;
  venueId: string;
  weekStartDate: string;
  weekEndDate: string;
  status: WeekLockStatus;
  lockedBy?: string;
  lockedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

