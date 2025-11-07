export enum SnapshotStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  LOCKED = 'LOCKED',
  ARCHIVED = 'ARCHIVED',
}

export interface ShiftSnapshotData {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  startTime: string;
  endTime: string;
  phaseId?: string;
  phaseName?: string;
  notes?: string;
}

export interface ShiftSnapshot {
  id: string;
  venueId: string;
  snapshotDate: string;
  startDate: string;
  endDate: string;
  status: SnapshotStatus;
  shiftsJson: ShiftSnapshotData[];
  version: number;
  previousSnapshotId?: string;
  checksum?: string;
  totalShifts: number;
  totalHours: number;
  createdBy: string;
  publishedBy?: string;
  publishedAt?: string;
  notes?: string;
  createdAt: string;
}

export interface CreateShiftSnapshotRequest {
  venueId: string;
  snapshotDate: string;
  startDate: string;
  endDate: string;
  shiftsJson: ShiftSnapshotData[];
  createdBy: string;
  notes?: string;
}

export interface UpdateShiftSnapshotRequest {
  shiftsJson?: ShiftSnapshotData[];
  status?: SnapshotStatus;
  notes?: string;
}

export interface PublishSnapshotRequest {
  publishedBy: string;
  notes?: string;
}

export interface SnapshotFilters {
  status?: SnapshotStatus;
  startDateFrom?: string;
  startDateTo?: string;
}

