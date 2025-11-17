'use client';

import { ScheduleResults } from '../ScheduleResults';
import { ScheduleWizard } from '../ScheduleWizard';
import { useScheduleGenerator } from '../../hooks/useScheduleGenerator';
import styles from './schedule-generator.module.css';

interface ScheduleGeneratorProps {
  venueId: string;
}

export function ScheduleGenerator({ venueId }: ScheduleGeneratorProps) {
  const {
    showResults,
    schedule,
    isStarting,
    isPolling,
    isPublishing,
    whatsAppEnabled,
    handleSubmitWithData,
    handlePublish,
    handleBack,
  } = useScheduleGenerator({ venueId });

  if (showResults && schedule) {
    return (
      <ScheduleResults
        schedule={schedule}
        onBack={handleBack}
        onPublish={handlePublish}
        isPublishing={isPublishing}
        whatsAppEnabled={whatsAppEnabled}
      />
    );
  }

  return (
    <div className={styles.container}>
      <ScheduleWizard
        venueId={venueId}
        onGenerate={handleSubmitWithData}
        isGenerating={isStarting || isPolling}
      />
    </div>
  );
}
