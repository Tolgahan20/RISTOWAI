export enum AbsenceCode {
  FERIE = 'FERIE', // Holiday
  ROL = 'ROL', // Permessi/ROL
  MAL = 'MAL', // Sickness
  INF = 'INF', // Work injury (INAIL)
  MAT = 'MAT', // Maternity
  PAT = 'PAT', // Paternity
  L104 = 'L104', // L.104 permits
  TRN = 'TRN', // Training
  ASS_NG = 'ASS_NG', // Unjustified absence
  REC_BO = 'REC_BO', // Hour bank recovery
  ALTRO = 'ALTRO', // Other
}

export const ABSENCE_CODE_LABELS: Record<AbsenceCode, string> = {
  [AbsenceCode.FERIE]: 'Ferie',
  [AbsenceCode.ROL]: 'Permessi/ROL',
  [AbsenceCode.MAL]: 'Malattia',
  [AbsenceCode.INF]: 'Infortunio (INAIL)',
  [AbsenceCode.MAT]: 'Maternità',
  [AbsenceCode.PAT]: 'Paternità',
  [AbsenceCode.L104]: 'Legge 104',
  [AbsenceCode.TRN]: 'Formazione',
  [AbsenceCode.ASS_NG]: 'Assenza non giustificata',
  [AbsenceCode.REC_BO]: 'Recupero banca ore',
  [AbsenceCode.ALTRO]: 'Altro',
};

export interface Absence {
  id: string;
  venueId: string;
  staffId: string;
  staffName?: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  hoursOptional?: number;
  reason: string;
  absenceCode?: AbsenceCode;
  documentReference?: string;
  managerNotes?: string;
  approved: boolean;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
  editedBy?: string;
  durationDays?: number;
}

export interface CreateAbsenceRequest {
  staffId: string;
  startDate: string;
  endDate: string;
  reason: string;
  absenceCode?: AbsenceCode;
  hoursOptional?: number;
  documentReference?: string;
  managerNotes?: string;
}

export type UpdateAbsenceRequest = Partial<CreateAbsenceRequest>; 

export interface ApproveAbsenceRequest {
  visualizeAs?: 'VACATION' | 'ROL' | 'NONE';
  hoursOverride?: number;
  managerNotes?: string;
}

export interface AbsenceStats {
  totalAbsences: number;
  pendingApprovals: number;
  approvedAbsences: number;
  byType: Record<AbsenceCode, number>;
  totalDays: number;
}

export interface AbsenceFilters {
  search?: string;
  staffId?: string;
  startDate?: string;
  endDate?: string;
  approved?: boolean;
  absenceCode?: AbsenceCode;
}

export type { PaginatedAbsencesResponse } from './paginated';

