export enum ShiftStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export enum ScheduleStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  ARCHIVED = 'ARCHIVED',
}

export interface Shift {
  id: string;
  staffId: string;
  staffName: string;
  staffRole: string;
  phaseId?: string;
  phaseName?: string;
  startTime: string;
  endTime: string;
  status: ShiftStatus;
  notes?: string;
}

export interface Schedule {
  id: string;
  venueId: string;
  venueName: string;
  startDate: string;
  endDate: string;
  status: ScheduleStatus;
  name?: string;
  notes?: string;
  aiMetadata?: {
    mode?: string;
    reasoning?: string;
    generatedAt?: string;
  };
  shifts: Shift[];
  createdAt: string;
  updatedAt: string;
}

export interface WeeklySchedule {
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  shifts: Shift[];
}

export interface StaffSchedule {
  staffId: string;
  staffName: string;
  staffRole: string;
  upcomingShifts: Shift[];
  totalHoursThisWeek: number;
  totalHoursNextWeek: number;
}

// UI-specific types for calendar grid
export interface CalendarDay {
  date: string;
  dayName: string;
  shifts: Shift[];
}

export interface TimeSlot {
  hour: number;
  shifts: Shift[];
}

export interface StaffColor {
  staffId: string;
  color: string;
}

