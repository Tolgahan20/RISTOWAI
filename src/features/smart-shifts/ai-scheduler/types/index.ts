export enum ScheduleMode {
  COVERAGE_FIRST = 'COVERAGE_FIRST',
  COST_HINT = 'COST_HINT',
  MANUAL_SEED = 'MANUAL_SEED',
  BALANCED = 'BALANCED',
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface ManualSeedShift {
  staffId: string;
  startTime: string;
  endTime: string;
  phaseId?: string;
}

export interface GenerateScheduleRequest {
  venueId: string;
  dateRange: DateRange;
  mode: ScheduleMode;
  manualSeeds?: ManualSeedShift[];
  staffIds?: string[];
}

export interface ShiftAssignment {
  id: string;
  staffId: string;
  staffName: string;
  role: string;
  startTime: string;
  endTime: string;
  hours: number;
  phaseId?: string;
  phaseName?: string;
  estimatedCost: number;
}

export interface PhaseCoverage {
  phaseId: string;
  phaseName: string;
  startTime: string;
  endTime: string;
  type: string;
  requiredStaff: number;
  assignedStaff: number;
  isCovered: boolean;
  status: 'success' | 'warning' | 'error';
}

export interface DailySummary {
  date: string;
  shiftsCount: number;
  totalHours: number;
  estimatedCost: number;
  phaseCoverage: PhaseCoverage[];
}

export interface ScheduleMetadata {
  mode: string;
  startDate: string;
  endDate: string;
  totalShifts: number;
  totalHours: number;
  totalEstimatedCost: number;
  phaseCoveragePercentage: number;
  aiReasoning?: string;
}

export interface ScheduleResponse {
  shifts: ShiftAssignment[];
  dailySummaries: DailySummary[];
  metadata: ScheduleMetadata;
  success: boolean;
  warnings?: string[];
}

export interface ScheduleModeOption {
  value: ScheduleMode;
  label: string;
  description: string;
  icon: string;
}

export interface ShiftToPublish {
  staffId: string;
  phaseId?: string;
  startTime: string;
  endTime: string;
  notes?: string;
}

export interface PublishScheduleRequest {
  venueId: string;
  startDate: string;
  endDate: string;
  name?: string;
  shifts: ShiftToPublish[];
  aiReasoning?: string;
  aiMode?: string;
}

export enum JobStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface JobStatusResponse {
  jobId: string;
  status: JobStatus;
  result?: ScheduleResponse;
  error?: any;
  createdAt: string;
  completedAt?: string;
}

export interface StartJobResponse {
  jobId: string;
  message: string;
  status: JobStatus;
}

