export enum PhaseType {
  HARD = 'HARD',
  SOFT = 'SOFT',
}

export interface RoleRequirement {
  role: string;
  minStaff: number;
  maxStaff?: number;
}

export interface Phase {
  id: string;
  venueId: string;
  name: string;
  startTime: string;
  endTime: string;
  type: PhaseType;
  roleRequirements: (RoleRequirement | string)[]; // Backend can return strings or objects
  daysOfWeek?: (number | string)[] | null; // Backend can return numbers or day names
  isActive: boolean;
  notes?: string | null;
  priority: number;
  createdAt: string;
  updatedAt: string;
  editedBy?: string | null;
}

export interface CreatePhaseRequest {
  name: string;
  startTime: string;
  endTime: string;
  type: PhaseType;
  roleRequirements: RoleRequirement[];
  daysOfWeek?: number[];
  notes?: string;
  priority?: number;
}

export interface UpdatePhaseRequest {
  name?: string;
  startTime?: string;
  endTime?: string;
  type?: PhaseType;
  roleRequirements?: RoleRequirement[];
  daysOfWeek?: number[];
  isActive?: boolean;
  notes?: string;
  priority?: number;
}

export const PHASE_TYPE_LABELS: Record<PhaseType, string> = {
  [PhaseType.HARD]: 'Obbligatoria',
  [PhaseType.SOFT]: 'Preferenziale',
};

export const DAYS_OF_WEEK = [
  { value: 0, label: 'Domenica', short: 'Dom' },
  { value: 1, label: 'Lunedì', short: 'Lun' },
  { value: 2, label: 'Martedì', short: 'Mar' },
  { value: 3, label: 'Mercoledì', short: 'Mer' },
  { value: 4, label: 'Giovedì', short: 'Gio' },
  { value: 5, label: 'Venerdì', short: 'Ven' },
  { value: 6, label: 'Sabato', short: 'Sab' },
];

export const COMMON_PHASE_NAMES = [
  'Preparazione',
  'Pranzo',
  'Cena',
  'Aperitivo',
  'Pausa',
  'Chiusura',
];

import type { PaginatedResponse } from '../../common/types/pagination';

export type PaginatedPhasesResponse = PaginatedResponse<Phase>;

export interface PhaseFilters {
  search?: string;
  type?: PhaseType;
  activeOnly?: boolean;
  dayOfWeek?: number;
}

