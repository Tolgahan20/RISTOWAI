export interface Export {
  id: string;
  venueId: string;
  startDate: string;
  endDate: string;
  status: ExportStatus;
  version: number;
  fileName?: string;
  checksum?: string;
  createdBy: string;
  metadata?: ExportMetadata;
  notes?: string;
  createdAt: string;
}

export enum ExportStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

export interface ExportMetadata {
  totalRows?: number;
  totalEmployees?: number;
  validationWarnings?: string[];
  validationErrors?: string[];
}

export interface CreateExportRequest {
  venueId: string;
  startDate: string;
  endDate: string;
  notes?: string;
}

export interface ValidationResult {
  isValid: boolean;
  warnings: string[];
  errors: string[];
}

