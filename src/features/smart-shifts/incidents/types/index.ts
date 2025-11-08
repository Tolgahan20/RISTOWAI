export enum IncidentType {
  NO_SHOW = 'NO_SHOW',
  LATE_ARRIVAL = 'LATE_ARRIVAL',
  EARLY_DEPARTURE = 'EARLY_DEPARTURE',
  ABSENCE_NO_NOTICE = 'ABSENCE_NO_NOTICE',
  ABSENCE_WITH_NOTICE = 'ABSENCE_WITH_NOTICE',
  POLICY_VIOLATION = 'POLICY_VIOLATION',
  PERFORMANCE_ISSUE = 'PERFORMANCE_ISSUE',
  OTHER = 'OTHER',
}

export enum IncidentSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum IncidentStatus {
  OPEN = 'OPEN',
  IN_REVIEW = 'IN_REVIEW',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export interface StaffSummary {
  id: string;
  name: string;
  email?: string;
  staffRole?: string;
}

export interface ShiftSummary {
  id: string;
  startTime: Date;
  endTime: Date;
  phaseId?: string;
}

export interface Incident {
  id: string;
  venueId: string;
  staffId: string;
  staff: StaffSummary;
  shiftId?: string;
  shift?: ShiftSummary;
  incidentDate: Date;
  incidentType: IncidentType;
  severity: IncidentSeverity;
  status: IncidentStatus;
  description: string;
  resolutionNotes?: string;
  reportedBy?: string;
  resolvedBy?: string;
  resolvedAt?: Date;
  actionTaken?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateIncidentRequest {
  venueId: string;
  staffId: string;
  shiftId?: string;
  incidentDate: string;
  incidentType: IncidentType;
  severity?: IncidentSeverity;
  description: string;
  reportedBy?: string;
}

export interface UpdateIncidentRequest {
  incidentDate?: string;
  incidentType?: IncidentType;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
  description?: string;
  resolutionNotes?: string;
  actionTaken?: string;
}

export interface ResolveIncidentRequest {
  resolutionNotes: string;
  actionTaken?: string;
  resolvedBy?: string;
}

export interface IncidentFilters {
  venueId?: string;
  staffId?: string;
  incidentType?: IncidentType;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedIncidentsQuery extends IncidentFilters {
  page?: number;
  limit?: number;
}

export interface PaginatedIncidentsResponse {
  data: Incident[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IncidentStats {
  total: number;
  byType: Record<string, number>;
  bySeverity: Record<string, number>;
  byStatus: Record<string, number>;
}

