export enum ContractType {
  FULL_TIME = 'FULL_TIME',
  PART_TIME = 'PART_TIME',
  SEASONAL = 'SEASONAL',
  TEMPORARY = 'TEMPORARY',
  INTERNSHIP = 'INTERNSHIP',
}

export const CONTRACT_TYPE_LABELS: Record<ContractType, string> = {
  [ContractType.FULL_TIME]: 'Tempo Pieno',
  [ContractType.PART_TIME]: 'Part-Time',
  [ContractType.SEASONAL]: 'Stagionale',
  [ContractType.TEMPORARY]: 'Temporaneo',
  [ContractType.INTERNSHIP]: 'Tirocinio',
};

export type PreferredShift = 'any' | 'morning' | 'afternoon' | 'evening' | 'night';

export interface DayAvailability {
  available: boolean;
  preferredHours?: { start: string; end: string }[];
  preferredShift?: PreferredShift;
  reason?: string;
}

export interface SpecificDayOff {
  date: string; // ISO date string
  reason: string;
}

export interface Availability {
  monday?: DayAvailability;
  tuesday?: DayAvailability;
  wednesday?: DayAvailability;
  thursday?: DayAvailability;
  friday?: DayAvailability;
  saturday?: DayAvailability;
  sunday?: DayAvailability;
  specificDaysOff?: SpecificDayOff[];
  preferences?: {
    maxConsecutiveDays?: number;
    preferredDaysOff?: string[];
    avoidEarlyMornings?: boolean;
    avoidLateNights?: boolean;
  };
}

export interface ContractClauses {
  allowancesFixed?: { [key: string]: number };
  overtimeRules?: string;
  benefits?: string[];
  notes?: string;
}

export interface ContractMetadata {
  ccnl?: string;
  level?: string;
  annualLeaveDays?: number;
  rolPermitHours?: number;
  [key: string]: unknown;
}

export interface Staff {
  id: string;
  venueId: string;
  venueMemberId?: string;
  staffRole: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  personalToken?: string;
  contractType: ContractType;
  weeklyHours: number;
  hourlyRate: number;
  ccnlLevel?: string;
  iban?: string;
  codiceFiscale?: string;
  birthDate?: string;
  hireDate: string;
  endDate?: string;
  clausesJson?: ContractClauses;
  contractMetadata?: ContractMetadata;
  skills?: string[];
  availability?: Availability;
  createdAt: string;
  updatedAt: string;
}

import type { PaginatedResponse } from '../../common/types/pagination';

export type PaginatedStaffResponse = PaginatedResponse<Staff>;

export interface StaffFilters {
  search?: string;
  role?: string;
  contractType?: string;
  activeOnly?: boolean;
}

export interface CreateStaffRequest {
  venueMemberId?: string;
  staffRole: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  contractType: ContractType;
  weeklyHours: number;
  hourlyRate: number;
  ccnlLevel?: string;
  iban?: string;
  codiceFiscale?: string;
  birthDate?: string;
  hireDate: string;
  endDate?: string;
  skills?: string[];
  availability?: Availability;
  clausesJson?: ContractClauses;
  contractMetadata?: ContractMetadata;
}

export interface UpdateStaffRequest {
  staffRole?: string;
  contractType?: ContractType;
  weeklyHours?: number;
  hourlyRate?: number;
  ccnlLevel?: string;
  iban?: string;
  codiceFiscale?: string;
  birthDate?: string;
  hireDate?: string;
  endDate?: string;
  skills?: string[];
  availability?: Availability;
  clausesJson?: ContractClauses;
  contractMetadata?: ContractMetadata;
}

export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export const DAY_LABELS: Record<string, string> = {
  monday: 'Lunedì',
  tuesday: 'Martedì',
  wednesday: 'Mercoledì',
  thursday: 'Giovedì',
  friday: 'Venerdì',
  saturday: 'Sabato',
  sunday: 'Domenica',
};

export const PREFERRED_SHIFT_LABELS: Record<PreferredShift, string> = {
  any: 'Qualsiasi',
  morning: 'Mattina (06:00-12:00)',
  afternoon: 'Pomeriggio (12:00-18:00)',
  evening: 'Sera (18:00-22:00)',
  night: 'Notte (22:00-06:00)',
};

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

// Common staff roles
export const COMMON_STAFF_ROLES = [
  'Cameriere',
  'Chef',
  'Sous Chef',
  'Barista',
  'Cassiere',
  'Manager',
  'Hostess',
  'Pizzaiolo',
  'Lavapiatti',
  'Runner',
  'Sommelier',
];

// Common skills
export const COMMON_SKILLS = [
  'POS',
  'Cucina',
  'Bar',
  'Servizio al tavolo',
  'Gestione cassa',
  'Inglese',
  'Francese',
  'Tedesco',
  'Vini',
  'Cocktail',
  'Pizzeria',
];
