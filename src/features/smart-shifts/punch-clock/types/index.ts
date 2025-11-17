export enum TimeEventKind {
  IN = 'IN',
  OUT = 'OUT',
  PAUSE_IN = 'PAUSE_IN',
  PAUSE_OUT = 'PAUSE_OUT',
}

export enum TimeEventSource {
  WEB = 'WEB',
  APP = 'APP',
  MANUAL = 'MANUAL',
  SYSTEM = 'SYSTEM',
}

export interface TimeEvent {
  id: string;
  staffId: string;
  staffName?: string;
  venueId: string;
  shiftId?: string;
  timestamp: string;
  kind: TimeEventKind;
  source: TimeEventSource;
  geolocationLat?: number;
  geolocationLon?: number;
  notes?: string;
  anomalyFlag: boolean;
  anomalyReason?: string;
  managerApproved: boolean;
  managerNotes?: string;
  createdAt: string;
}

export interface ClockInRequest {
  staffId: string;
  venueId: string;
  shiftId?: string;
  geolocationLat?: number;
  geolocationLon?: number;
  notes?: string;
}

export interface ClockOutRequest {
  staffId: string;
  venueId: string;
  notes?: string;
}

export interface ResolveAnomalyRequest {
  managerNotes: string;
  approved: boolean;
}

export interface PunchClockStatus {
  isClockedIn: boolean;
  lastEvent?: TimeEvent;
  currentShift?: {
    id: string;
    startTime: string;
    endTime: string;
  };
}

