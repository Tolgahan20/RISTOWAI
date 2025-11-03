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

  const handleAddPhase = () => {
    if (!isValidWorkPhase(editingPhase)) {
      return;
    }

    const newPhase: WorkPhase = {
      name: editingPhase.name,
      startTime: editingPhase.startTime,
      endTime: editingPhase.endTime,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phases.length === 0) {
      return;
    }
    await onSave({ phases });
  };

  return {
    phases,
    editingPhase,
    setEditingPhase,
    handleAddPhase,
    handleRemovePhase,
    handleUsePreset,
    handleSubmit,
    presets: WORK_PHASE_PRESETS,
  };
};

