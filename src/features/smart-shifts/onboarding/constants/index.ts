import type { PhaseType } from '../types';

/**
 * Days of the week for opening hours configuration
 */
export const DAYS = [
  { key: 'monday', label: 'Lunedì' },
  { key: 'tuesday', label: 'Martedì' },
  { key: 'wednesday', label: 'Mercoledì' },
  { key: 'thursday', label: 'Giovedì' },
  { key: 'friday', label: 'Venerdì' },
  { key: 'saturday', label: 'Sabato' },
  { key: 'sunday', label: 'Domenica' },
] as const;

/**
 * Italian restaurant opening hours presets
 */
export const ITALIAN_OPENING_HOURS_PRESETS = {
  standard: {
    monday: { open: '12:00', close: '15:00', eveningOpen: '19:00', eveningClose: '23:00' },
    tuesday: { open: '12:00', close: '15:00', eveningOpen: '19:00', eveningClose: '23:00' },
    wednesday: { open: '12:00', close: '15:00', eveningOpen: '19:00', eveningClose: '23:00' },
    thursday: { open: '12:00', close: '15:00', eveningOpen: '19:00', eveningClose: '23:00' },
    friday: { open: '12:00', close: '15:00', eveningOpen: '19:00', eveningClose: '23:00' },
    saturday: { open: '12:00', close: '15:00', eveningOpen: '19:00', eveningClose: '23:00' },
    sunday: { open: '12:00', close: '15:00', eveningOpen: '19:00', eveningClose: '23:00' },
  },
  weekdayOnly: {
    monday: { open: '12:00', close: '15:00', eveningOpen: '19:00', eveningClose: '23:00' },
    tuesday: { open: '12:00', close: '15:00', eveningOpen: '19:00', eveningClose: '23:00' },
    wednesday: { open: '12:00', close: '15:00', eveningOpen: '19:00', eveningClose: '23:00' },
    thursday: { open: '12:00', close: '15:00', eveningOpen: '19:00', eveningClose: '23:00' },
    friday: { open: '12:00', close: '15:00', eveningOpen: '19:00', eveningClose: '23:00' },
    saturday: { open: '12:00', close: '15:00', eveningOpen: '19:00', eveningClose: '23:00' },
  },
} as const;

/**
 * Work phase presets for Italian restaurants
 */
export const WORK_PHASE_PRESETS = [
  { name: 'Pranzo', startTime: '12:00', endTime: '15:00', type: 'HARD' as PhaseType },
  { name: 'Cena', startTime: '19:00', endTime: '23:00', type: 'HARD' as PhaseType },
  { name: 'Aperitivo', startTime: '18:00', endTime: '20:00', type: 'SOFT' as PhaseType },
  { name: 'Colazione', startTime: '07:00', endTime: '11:00', type: 'HARD' as PhaseType },
] as const;

/**
 * Italian national holidays (2024-2025)
 */
export const ITALIAN_HOLIDAYS = [
  { date: '2024-01-01', name: 'Capodanno' },
  { date: '2024-01-06', name: 'Epifania' },
  { date: '2024-04-25', name: 'Festa della Liberazione' },
  { date: '2024-05-01', name: 'Festa dei Lavoratori' },
  { date: '2024-06-02', name: 'Festa della Repubblica' },
  { date: '2024-08-15', name: 'Ferragosto' },
  { date: '2024-11-01', name: 'Tutti i Santi' },
  { date: '2024-12-08', name: 'Immacolata Concezione' },
  { date: '2024-12-25', name: 'Natale' },
  { date: '2024-12-26', name: 'Santo Stefano' },
  { date: '2025-01-01', name: 'Capodanno' },
  { date: '2025-01-06', name: 'Epifania' },
  { date: '2025-04-25', name: 'Festa della Liberazione' },
  { date: '2025-05-01', name: 'Festa dei Lavoratori' },
  { date: '2025-06-02', name: 'Festa della Repubblica' },
  { date: '2025-08-15', name: 'Ferragosto' },
  { date: '2025-11-01', name: 'Tutti i Santi' },
  { date: '2025-12-08', name: 'Immacolata Concezione' },
  { date: '2025-12-25', name: 'Natale' },
  { date: '2025-12-26', name: 'Santo Stefano' },
] as const;

