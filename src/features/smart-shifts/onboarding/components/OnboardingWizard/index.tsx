'use client';

import Image from 'next/image';
import { HolidayCalendarData, OnboardingStep, OpeningHours, StaffImportData, TimeCaptureData, VenueInfoData, WorkPhasesData, type OnboardingSession } from '../../types';
import { VenueInfoStep } from '../VenueInfoStep';
import { OpeningHoursStep } from '../OpeningHoursStep';
import { WorkPhasesStep } from '../WorkPhasesStep';
import { StaffImportStep } from '../StaffImportStep';
import { HolidayCalendarStep } from '../HolidayCalendarStep';
import { TimeCaptureStep } from '../TimeCaptureStep';
import { ReviewStep } from '../ReviewStep';
import { useOnboarding } from '../../hooks/useOnboarding';
import styles from './onboarding-wizard.module.css';

interface OnboardingWizardProps {
  session: OnboardingSession;
}

const STEPS = [
  'Locale',
  'Orari',
  'Fasi',
  'Staff',
  'Festività',
  'Presenze',
  'Riepilogo',
];

export function OnboardingWizard({ session }: OnboardingWizardProps) {
  const { 
    saveVenueInfo, isSavingVenueInfo,
    saveOpeningHours, isSavingOpeningHours,
    saveWorkPhases, isSavingWorkPhases,
    saveStaffImport, isSavingStaffImport,
    saveHolidayCalendar, isSavingHolidayCalendar,
    saveTimeCapture, isSavingTimeCapture,
    complete, isCompleting
  } = useOnboarding();

  const currentIndex = Object.values(OnboardingStep).indexOf(session.currentStep);

  return (
    <div className={styles.container}>
      {/* Simple top progress bar */}
      <div className={styles.topBar}>
        <div className={styles.logo}>
          <Image src="/full_logo_black.svg" alt="Ristowai" width={120} height={40} priority />
        </div>
        <div className={styles.progress}>
          {STEPS.map((step, index) => (
            <div
              key={index}
              className={`${styles.dot} ${
                index === currentIndex ? styles.active :
                index < currentIndex ? styles.done : ''
              }`}
            />
          ))}
        </div>
        <div className={styles.stepText}>
          {currentIndex + 1} / {STEPS.length}
        </div>
      </div>

      {/* Content */}
      <div className={styles.content}>
        {session.currentStep === OnboardingStep.VENUE_INFO && (
          <VenueInfoStep
            onSave={saveVenueInfo as (data: VenueInfoData) => Promise<void>}
            isSaving={isSavingVenueInfo}
            initialData={session.venueInfo}
          />
        )}
        {session.currentStep === OnboardingStep.OPENING_HOURS && (
          <OpeningHoursStep
            onSave={saveOpeningHours as (data: { openingHours: OpeningHours }) => Promise<void>}
            isSaving={isSavingOpeningHours}
            initialData={session.openingHours}
          />
        )}
        {session.currentStep === OnboardingStep.WORK_PHASES && (
          <WorkPhasesStep
            onSave={saveWorkPhases as (data: WorkPhasesData) => Promise<void>}
            isSaving={isSavingWorkPhases}
            initialData={session.workPhases}
          />
        )}
        {session.currentStep === OnboardingStep.STAFF_IMPORT && (
          <StaffImportStep
            onSave={saveStaffImport as (data: StaffImportData) => Promise<void>}
            isSaving={isSavingStaffImport}
            initialData={session.staffImport}
          />
        )}
        {session.currentStep === OnboardingStep.HOLIDAY_CALENDAR && (
          <HolidayCalendarStep
            onSave={saveHolidayCalendar as (data: HolidayCalendarData) => Promise<void>}
            isSaving={isSavingHolidayCalendar}
            initialData={session.holidayCalendar}
          />
        )}
        {session.currentStep === OnboardingStep.TIME_CAPTURE && (
          <TimeCaptureStep
            onSave={saveTimeCapture as (data: TimeCaptureData) => Promise<void>}
            isSaving={isSavingTimeCapture}
            initialData={session.timeCapture}
          />
        )}
        {session.currentStep === OnboardingStep.REVIEW && (
          <ReviewStep
            session={session}
            onComplete={complete}
            isCompleting={isCompleting}
          />
        )}
      </div>
    </div>
  );
}
