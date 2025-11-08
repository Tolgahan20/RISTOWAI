import { IncidentType, IncidentSeverity, IncidentStatus } from '../types';

export const getIncidentTypeLabel = (type: IncidentType): string => {
  const labels: Record<IncidentType, string> = {
    [IncidentType.NO_SHOW]: 'Assente',
    [IncidentType.LATE_ARRIVAL]: 'Arrivo in Ritardo',
    [IncidentType.EARLY_DEPARTURE]: 'Partenza Anticipata',
    [IncidentType.ABSENCE_NO_NOTICE]: 'Assenza Senza Preavviso',
    [IncidentType.ABSENCE_WITH_NOTICE]: 'Assenza Con Preavviso',
    [IncidentType.POLICY_VIOLATION]: 'Violazione Policy',
    [IncidentType.PERFORMANCE_ISSUE]: 'Problema Prestazioni',
    [IncidentType.OTHER]: 'Altro',
  };
  return labels[type] || type;
};

export const getIncidentSeverityLabel = (severity: IncidentSeverity): string => {
  const labels: Record<IncidentSeverity, string> = {
    [IncidentSeverity.LOW]: 'Bassa',
    [IncidentSeverity.MEDIUM]: 'Media',
    [IncidentSeverity.HIGH]: 'Alta',
    [IncidentSeverity.CRITICAL]: 'Critica',
  };
  return labels[severity] || severity;
};

export const getIncidentStatusLabel = (status: IncidentStatus): string => {
  const labels: Record<IncidentStatus, string> = {
    [IncidentStatus.OPEN]: 'Aperto',
    [IncidentStatus.IN_REVIEW]: 'In Revisione',
    [IncidentStatus.RESOLVED]: 'Risolto',
    [IncidentStatus.CLOSED]: 'Chiuso',
  };
  return labels[status] || status;
};

export const getIncidentSeverityColor = (severity: IncidentSeverity): string => {
  const colors: Record<IncidentSeverity, string> = {
    [IncidentSeverity.LOW]: '#10b981', // green
    [IncidentSeverity.MEDIUM]: '#f59e0b', // yellow
    [IncidentSeverity.HIGH]: '#ef4444', // red
    [IncidentSeverity.CRITICAL]: '#dc2626', // dark red
  };
  return colors[severity] || '#6b7280';
};

export const getIncidentStatusColor = (status: IncidentStatus): string => {
  const colors: Record<IncidentStatus, string> = {
    [IncidentStatus.OPEN]: '#ef4444', // red
    [IncidentStatus.IN_REVIEW]: '#f59e0b', // yellow
    [IncidentStatus.RESOLVED]: '#10b981', // green
    [IncidentStatus.CLOSED]: '#6b7280', // gray
  };
  return colors[status] || '#6b7280';
};

