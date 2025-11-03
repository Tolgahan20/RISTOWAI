import type { WorkPhase } from '../types';

/**
 * Validate if a work phase has all required fields
 */
export function isValidWorkPhase(phase: Partial<WorkPhase>): phase is WorkPhase {
  return !!(
    phase.name &&
    phase.startTime &&
    phase.endTime &&
    phase.type
  );
}

/**
 * Remove a phase from the list by index
 */
export function removePhaseAtIndex(phases: WorkPhase[], index: number): WorkPhase[] {
  return phases.filter((_, i) => i !== index);
}

/**
 * Add a new phase to the list
 */
export function addPhaseToList(phases: WorkPhase[], newPhase: WorkPhase): WorkPhase[] {
  return [...phases, newPhase];
}

