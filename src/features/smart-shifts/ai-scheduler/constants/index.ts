import { ScheduleMode, type ScheduleModeOption } from '../types';

export const SCHEDULE_MODE_OPTIONS: ScheduleModeOption[] = [
  {
    value: ScheduleMode.BALANCED,
    label: 'Bilanciato',
    description: 'Equilibrio tra copertura completa e costi ragionevoli',
    icon: 'scale',
  },
  {
    value: ScheduleMode.COVERAGE_FIRST,
    label: 'Priorità Copertura',
    description: 'Garantisce la copertura di tutte le fasi critiche',
    icon: 'shield',
  },
  {
    value: ScheduleMode.COST_HINT,
    label: 'Ottimizzazione Costi',
    description: 'Minimizza le ore programmate mantenendo la copertura minima',
    icon: 'dollar-sign',
  },
  {
    value: ScheduleMode.MANUAL_SEED,
    label: 'Completamento Manuale',
    description: 'Completa i turni già inseriti manualmente',
    icon: 'edit',
  },
];


