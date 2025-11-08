import { AnomalyType } from '../types';

/**
 * Get the start of the week (Monday) for a given date
 */
export const getWeekStart = (date: Date): Date => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is sunday
  return new Date(d.setDate(diff));
};

/**
 * Format date as YYYY-MM-DD
 */
export const formatDateForAPI = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

/**
 * Get anomaly type label in Italian
 */
export const getAnomalyTypeLabel = (type: AnomalyType): string => {
  const labels: Record<AnomalyType, string> = {
    [AnomalyType.LATE_ARRIVAL]: 'Arrivo in Ritardo',
    [AnomalyType.EARLY_DEPARTURE]: 'Uscita Anticipata',
    [AnomalyType.OVERTIME]: 'Straordinario',
    [AnomalyType.MISSING_PUNCH]: 'Timbratura Mancante',
    [AnomalyType.OTHER]: 'Altro',
  };
  return labels[type];
};

/**
 * Get anomaly severity color
 */
export const getAnomalySeverityColor = (severity: string): string => {
  const colors: Record<string, string> = {
    low: '#10b981',
    medium: '#f59e0b',
    high: '#ef4444',
  };
  return colors[severity] || '#6b7280';
};

/**
 * Format week range for display
 */
export const formatWeekRange = (startDate: string): string => {
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);

  return `${start.toLocaleDateString('it-IT', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('it-IT', { day: 'numeric', month: 'short', year: 'numeric' })}`;
};

