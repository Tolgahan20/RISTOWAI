import { useState } from 'react';
import type { OpeningHours } from '../types';
import { ITALIAN_OPENING_HOURS_PRESETS } from '../constants';
import {
  formatOpeningHoursForBackend,
  toggleDayInOpeningHours,
  updateDayField,
} from '../utils';

interface UseOpeningHoursStepProps {
  onSave: (data: { openingHours: OpeningHours }) => Promise<void>;
  initialData?: { openingHours?: OpeningHours } | null;
}

export const useOpeningHoursStep = ({
  onSave,
  initialData,
}: UseOpeningHoursStepProps) => {
  const [openingHours, setOpeningHours] = useState<OpeningHours>(
    initialData?.openingHours || {}
  );
  const [useSiesta] = useState(true);

  const applyPreset = (preset: 'standard' | 'weekdayOnly') => {
    setOpeningHours(ITALIAN_OPENING_HOURS_PRESETS[preset]);
  };

  const handleDayChange = (day: string, field: string, value: string) => {
    setOpeningHours(updateDayField(openingHours, day, field, value));
  };

  const toggleDay = (day: string) => {
    setOpeningHours(toggleDayInOpeningHours(openingHours, day));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedHours = formatOpeningHoursForBackend(openingHours);
    await onSave({ openingHours: formattedHours });
  };

  return {
    openingHours,
    useSiesta,
    applyPreset,
    handleDayChange,
    toggleDay,
    handleSubmit,
  };
};

