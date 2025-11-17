export enum AlertStatus {
  PENDING = 'PENDING',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
}

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
}

export interface ContractAlert {
  id: string;
  staffId: string;
  venueId: string;
  contractEndDate: string;
  daysUntilExpiry: number;
  severity: AlertSeverity;
  status: AlertStatus;
  message: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  resolvedAt?: string;
  resolvedBy?: string;
  createdAt: string;
  updatedAt: string;
  staff?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    staffRole: string;
    contractType: string;
  };
}

export interface ContractAlertCount {
  count: number;
}

