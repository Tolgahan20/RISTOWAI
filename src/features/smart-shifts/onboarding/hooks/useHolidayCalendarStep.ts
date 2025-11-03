import { useState } from 'react';
import type { HolidayCalendarData, Holiday } from '../types';
import { ITALIAN_HOLIDAYS } from '../constants';

interface UseHolidayCalendarStepProps {
  onSave: (data: HolidayCalendarData) => Promise<void>;
  initialData?: HolidayCalendarData | null;
}

export const useHolidayCalendarStep = ({
  onSave,
  initialData,
}: UseHolidayCalendarStepProps) => {
  const [holidays, setHolidays] = useState<Holiday[]>(
    initialData?.holidays || []
  );
  const [editingHoliday, setEditingHoliday] = useState<Partial<Holiday>>({
    date: '',
    name: '',
    isPaid: true,
  });

  const handleAddHoliday = () => {
    if (!editingHoliday.date || !editingHoliday.name) {
      return;
    }

    const newHoliday: Holiday = {
      date: editingHoliday.date,
      name: editingHoliday.name,
      isPaid: editingHoliday.isPaid ?? true,
    };

    setHolidays([...holidays, newHoliday]);
    setEditingHoliday({
      date: '',
      name: '',
      isPaid: true,
    });
  };

  const handleRemoveHoliday = (index: number) => {
    setHolidays(holidays.filter((_, i) => i !== index));
  };

  const handleLoadPreset = () => {
    const formattedHolidays: Holiday[] = ITALIAN_HOLIDAYS.map((holiday) => ({
      date: holiday.date,
      name: holiday.name,
      isPaid: true,
    }));
    setHolidays(formattedHolidays);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ holidays });
  };

  const handleSkip = async () => {
    await onSave({ holidays: [] });
  };

  return {
    holidays,
    editingHoliday,
    setEditingHoliday,
    handleAddHoliday,
    handleRemoveHoliday,
    handleLoadPreset,
    handleSubmit,
    handleSkip,
  };
};

