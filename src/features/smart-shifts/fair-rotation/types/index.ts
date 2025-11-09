export interface StaffFairness {
  staffId: string;
  staffName: string;
  role: string;
  weekendShiftsCount: number;
  totalShiftsCount: number;
  weekendPercentage: number;
  totalHours: number;
  weekendHours: number;
  fairnessScore: number;
  deviationFromAverage: number;
}

export interface FairnessStats {
  startDate: string;
  endDate: string;
  overallFairnessScore: number;
  averageWeekendShifts: number;
  standardDeviation: number;
  staffFairness: StaffFairness[];
  totalWeekendShifts: number;
  recommendation: string;
}

export interface GetFairnessStatsParams {
  venueId: string;
  startDate: string;
  endDate: string;
}

