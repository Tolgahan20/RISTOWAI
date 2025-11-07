export interface StaffAvailability {
  staffId: string;
  name: string;
  role: string;
  weeklyHours: number;
  isAvailable: boolean;
  unavailabilityReason: string | null;
  absences?: Array<{
    startDate: string;
    endDate: string;
    absenceCode: string;
    reason: string;
  }>;
}

export interface AvailabilityResponse {
  staff: StaffAvailability[];
  totalStaff: number;
  availableCount: number;
  unavailableCount: number;
}

export interface CheckAvailabilityRequest {
  venueId: string;
  startDate: string;
  endDate: string;
}

