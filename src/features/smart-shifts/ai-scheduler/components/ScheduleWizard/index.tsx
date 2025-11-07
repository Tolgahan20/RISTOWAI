'use client';

import React, { useState } from 'react';
import { Check } from 'react-feather';
import { Button } from '@/components/dashboard/ui';
import { DateRangeStep } from './steps/DateRangeStep';
import { StaffAvailabilityStep } from './steps/StaffAvailabilityStep';
import { PhaseSelectionStep } from './steps/PhaseSelectionStep';
import { ReviewStep } from './steps/ReviewStep';
import type { ScheduleMode } from '../../types';
import styles from './schedule-wizard.module.css';

interface ScheduleWizardProps {
  venueId: string;
  onGenerate: (data: {
    dateRange: { startDate: string; endDate: string };
    mode: ScheduleMode;
    staffIds?: string[];
    phaseIds?: string[];
    phaseOverrides?: PhaseOverride[];
  }) => void;
  isGenerating: boolean;
}

const STEPS = [
  { id: 1, title: 'Periodo e Modalità', description: 'Seleziona date e tipo di generazione' },
  { id: 2, title: 'Disponibilità Staff', description: 'Verifica chi è disponibile' },
  { id: 3, title: 'Selezione Fasi', description: 'Scegli quali fasi includere' },
  { id: 4, title: 'Revisione', description: 'Controlla e genera' },
];

export interface PhaseOverride {
  phaseId: string;
  requiredStaff: number;
}

export const ScheduleWizard: React.FC<ScheduleWizardProps> = ({
  venueId,
  onGenerate,
  isGenerating,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    dateRange: { startDate: '', endDate: '' },
    mode: 'COVERAGE_FIRST' as ScheduleMode,
    selectedStaffIds: [] as string[],
    selectedPhaseIds: [] as string[],
    phaseOverrides: [] as PhaseOverride[],
  });

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleGenerate = () => {
    onGenerate({
      dateRange: formData.dateRange,
      mode: formData.mode,
      staffIds: formData.selectedStaffIds.length > 0 ? formData.selectedStaffIds : undefined,
      phaseIds: formData.selectedPhaseIds.length > 0 ? formData.selectedPhaseIds : undefined,
      phaseOverrides: formData.phaseOverrides.length > 0 ? formData.phaseOverrides : undefined,
    });
  };

  return (
    <div className={styles.container}>
      {/* Progress Steps */}
      <div className={styles.progressBar}>
        {STEPS.map((step, index) => (
          <div key={step.id} className={styles.stepWrapper}>
            <div
              className={`${styles.stepIndicator} ${
                currentStep === step.id
                  ? styles.stepActive
                  : currentStep > step.id
                    ? styles.stepCompleted
                    : styles.stepPending
              }`}
            >
              {currentStep > step.id ? (
                <Check size={20} />
              ) : (
                <span>{step.id}</span>
              )}
            </div>
            <div className={styles.stepInfo}>
              <div className={styles.stepTitle}>{step.title}</div>
              <div className={styles.stepDescription}>{step.description}</div>
            </div>
            {index < STEPS.length - 1 && <div className={styles.stepConnector} />}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <div className={styles.stepContent}>
        {currentStep === 1 && (
          <DateRangeStep
            dateRange={formData.dateRange}
            mode={formData.mode}
            onUpdate={(dateRange, mode) =>
              updateFormData({ dateRange, mode })
            }
          />
        )}

        {currentStep === 2 && (
          <StaffAvailabilityStep
            venueId={venueId}
            dateRange={formData.dateRange}
            selectedStaffIds={formData.selectedStaffIds}
            onUpdate={(staffIds) => updateFormData({ selectedStaffIds: staffIds })}
          />
        )}

        {currentStep === 3 && (
          <PhaseSelectionStep
            venueId={venueId}
            selectedPhaseIds={formData.selectedPhaseIds}
            phaseOverrides={formData.phaseOverrides}
            onUpdateSelection={(phaseIds) => updateFormData({ selectedPhaseIds: phaseIds })}
            onUpdateOverrides={(overrides) => updateFormData({ phaseOverrides: overrides })}
          />
        )}

        {currentStep === 4 && (
          <ReviewStep
            venueId={venueId}
            dateRange={formData.dateRange}
            mode={formData.mode}
            selectedStaffIds={formData.selectedStaffIds}
            selectedPhaseIds={formData.selectedPhaseIds}
            phaseOverrides={formData.phaseOverrides}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className={styles.navigation}>
        <Button
          variant="ghost"
          onClick={handlePrevious}
          disabled={currentStep === 1 || isGenerating}
        >
          Indietro
        </Button>

        {currentStep < STEPS.length ? (
          <Button
            onClick={handleNext}
            disabled={
              (currentStep === 1 && (!formData.dateRange.startDate || !formData.dateRange.endDate)) ||
              isGenerating
            }
          >
            Avanti
          </Button>
        ) : (
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            variant="primary"
          >
            {isGenerating ? 'Generazione in corso...' : 'Genera Turni con AI'}
          </Button>
        )}
      </div>
    </div>
  );
};

