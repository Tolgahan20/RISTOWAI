export interface PhaseCoverage {
  phaseId: string;
  phaseName: string;
  requiredStaff: number;
  assignedStaff: number;
  coveragePercentage: number;
  status: 'covered' | 'partial' | 'uncovered';
}

export interface DailyCoverage {
  date: string;
  phases: PhaseCoverage[];
  overallCoveragePercentage: number;
}

export interface StaffStatus {
  available: number;
  onShift: number;
  absent: number;
  total: number;
}

export interface CostEstimate {
  totalPlannedHours: number;
  totalEstimatedCost: number;
  costByRole: {
    role: string;
    hours: number;
    cost: number;
  }[];
}

export interface IncidentStats {
  total: number;
  resolved: number;
  pending: number;
}

export interface DashboardKpis {
  phaseFillRate: {
    overall: number;
    dailyCoverage: DailyCoverage[];
  };
  staffStatus: StaffStatus;
  costEstimate: CostEstimate;
  incidents: IncidentStats;
  overtimeHours: number;
  managerTimeSaved: {
    hoursPerWeek: number;
    percentageImprovement: number;
  };
}

export interface GetDashboardKpisParams {
  venueId: string;
  startDate?: string;
  endDate?: string;
}

