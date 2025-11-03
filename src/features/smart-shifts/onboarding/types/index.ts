import { Venue } from "../../venues/types";

export enum OnboardingStep {
  VENUE_INFO = 'VENUE_INFO',
  OPENING_HOURS = 'OPENING_HOURS',
  WORK_PHASES = 'WORK_PHASES',
  STAFF_IMPORT = 'STAFF_IMPORT',
  HOLIDAY_CALENDAR = 'HOLIDAY_CALENDAR',
  TIME_CAPTURE = 'TIME_CAPTURE',
  REVIEW = 'REVIEW',
}

export enum VenueType {
  RESTAURANT = 'RESTAURANT',
  BAR = 'BAR',
  CAFE = 'CAFE',
  HOTEL = 'HOTEL',
  CATERING = 'CATERING',
}

export enum PhaseType {
  HARD = 'HARD',
  SOFT = 'SOFT',
}

export enum ContractType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  SEASONAL = 'SEASONAL',
  TEMPORARY = 'TEMPORARY',
  INTERNSHIP = 'INTERNSHIP',
}

export enum TimeCaptureMethod {
  MANUAL = 'MANUAL',
  AUTO = 'AUTO',
  HYBRID = 'HYBRID',
}

export interface OpeningHours {
  monday?: { open: string; close: string };
  tuesday?: { open: string; close: string };
  wednesday?: { open: string; close: string };
  thursday?: { open: string; close: string };
  friday?: { open: string; close: string };
  saturday?: { open: string; close: string };
  sunday?: { open: string; close: string };
}

export interface VenueInfoData {
  name: string;
  address?: string;
  timezone: string;
  type: VenueType;
  taxId?: string; // Partita IVA / Codice Fiscale
  openingHours?: OpeningHours;
  settings?: any;
}

export interface RoleRequirement {
  role: string;
  minStaff: number;
  maxStaff?: number;
}

export interface WorkPhase {
  name: string;
  startTime: string;
  endTime: string;
  type: PhaseType;
  roleRequirements: RoleRequirement[];
  daysOfWeek?: number[];
  priority?: number;
}

export interface WorkPhasesData {
  phases: WorkPhase[];
}

export interface StaffMember {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  codiceFiscale?: string;
  birthDate?: string;
  iban?: string;
  ccnlLevel?: string;
  role: string;
  contractType?: ContractType;
  hourlyRate?: number;
  weeklyContractHours?: number;
}

export interface StaffImportData {
  staff: StaffMember[];
}

export interface Holiday {
  date: string;
  name: string;
  isPaid: boolean;
}

export interface HolidayCalendarData {
  holidays: Holiday[];
}

export interface TimeCaptureData {
  method: TimeCaptureMethod;
  requirePhotoVerification: boolean;
  allowEarlyClockIn: boolean;
  earlyClockInMinutes?: number;
  allowLateClockOut: boolean;
  lateClockOutMinutes?: number;
  autoBreakDeduction: boolean;
  breakDurationMinutes?: number;
}

export interface OnboardingSession {
  id: string;
  userId: string;
  currentStep: OnboardingStep;
  isCompleted: boolean;
  venueId: string | null;
  venueInfo: VenueInfoData | null;
  openingHours: { openingHours?: OpeningHours } | null;
  workPhases: WorkPhasesData | null;
  staffImport: StaffImportData | null;
  holidayCalendar: HolidayCalendarData | null;
  timeCapture: TimeCaptureData | null;
  progressPercentage: number;
  completedSteps: OnboardingStep[];
  createdAt: string;
  updatedAt: string;
}

export interface OnboardingCompleteResponse {
  session: OnboardingSession;
  venue: Venue;
  phases: WorkPhase[];
  staff: StaffMember[];
}

