import { useState } from 'react';
import type { WorkPhasesData, WorkPhase, PhaseType } from '../types';
import { WORK_PHASE_PRESETS } from '../constants';
import { isValidWorkPhase, removePhaseAtIndex, addPhaseToList } from '../utils';

interface UseWorkPhasesStepProps {
  onSave: (data: WorkPhasesData) => Promise<void>;
  initialData?: WorkPhasesData | null;
}

export const useWorkPhasesStep = ({
  onSave,
  initialData,
}: UseWorkPhasesStepProps) => {
  const [phases, setPhases] = useState<WorkPhase[]>(initialData?.phases || []);
  const [editingPhase, setEditingPhase] = useState<Partial<WorkPhase>>({
    name: '',
    startTime: '',
    endTime: '',
    type: 'HARD' as PhaseType,
    roleRequirements: [],
  });

  const formatTimeToHHmm = (time: string): string => {
    // Ensure time is in HH:mm format (remove seconds if present)
    if (!time) return time;
    return time.substring(0, 5);
  };

  const handleAddPhase = () => {
    if (!isValidWorkPhase(editingPhase)) {
      return;
    }

    const newPhase: WorkPhase = {
      name: editingPhase.name,
      startTime: formatTimeToHHmm(editingPhase.startTime!),
      endTime: formatTimeToHHmm(editingPhase.endTime!),
      type: editingPhase.type,
      roleRequirements: [],
    };

    setPhases(addPhaseToList(phases, newPhase));
    setEditingPhase({
      name: '',
      startTime: '',
      endTime: '',
      type: 'HARD' as PhaseType,
      roleRequirements: [],
    });
  };

  const handleRemovePhase = (index: number) => {
    setPhases(removePhaseAtIndex(phases, index));
  };

  const handleUsePreset = (preset: typeof WORK_PHASE_PRESETS[number]) => {
    setEditingPhase({
      name: preset.name,
      startTime: preset.startTime,
      endTime: preset.endTime,
      type: preset.type,
      roleRequirements: [],
    });
  };

  const handleSubmit = async (e: React.FormEvent, templatesFromIndustry?: WorkPhase[]) => {
    e.preventDefault();
    const phasesToSave = templatesFromIndustry || phases;
    if (phasesToSave.length === 0) {
      return;
    }
    
    // Format all times to HH:mm before saving
    const formattedPhases = phasesToSave.map((phase) => ({
      ...phase,
      startTime: formatTimeToHHmm(phase.startTime),
      endTime: formatTimeToHHmm(phase.endTime),
    }));
    
    await onSave({ phases: formattedPhases });
  };

  return {
    phases,
    setPhases,
    editingPhase,
    setEditingPhase,
    handleAddPhase,
    handleRemovePhase,
    handleUsePreset,
    handleSubmit,
    presets: WORK_PHASE_PRESETS,
  };
};

