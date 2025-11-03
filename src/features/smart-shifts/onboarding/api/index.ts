import { axiosInstance } from '../../common/api/axios';
import { api } from '../../common/constants/api';
import type {
  OnboardingSession,
  VenueInfoData,
  WorkPhasesData,
  StaffImportData,
  HolidayCalendarData,
  TimeCaptureData,
  OnboardingCompleteResponse,
  OnboardingStep,
  OpeningHours,
} from '../types';

/**
 * Start or resume onboarding
 */
export const startOnboarding = async (): Promise<OnboardingSession> => {
  const response = await axiosInstance.post(api.onboarding.start);
  return response.data;
};

/**
 * Get current onboarding session
 */
export const getSession = async (): Promise<OnboardingSession> => {
  const response = await axiosInstance.get(api.onboarding.session);
  return response.data;
};

/**
 * Step 1: Save venue information
 */
export const saveVenueInfo = async (
  data: VenueInfoData,
): Promise<OnboardingSession> => {
  const response = await axiosInstance.post(api.onboarding.venueInfo, data);
  return response.data;
};

export const saveOpeningHours = async (
  data: { openingHours?: OpeningHours },
): Promise<OnboardingSession> => {
  const response = await axiosInstance.post(api.onboarding.openingHours, data);
  return response.data;
};

/**
 * Step 2: Save work phases
 */
export const saveWorkPhases = async (
  data: WorkPhasesData,
): Promise<OnboardingSession> => {
  const response = await axiosInstance.post(api.onboarding.workPhases, data);
  return response.data;
};

/**
 * Step 3: Import staff
 */
export const saveStaffImport = async (
  data: StaffImportData,
): Promise<OnboardingSession> => {
  const response = await axiosInstance.post(api.onboarding.staffImport, data);
  return response.data;
};

/**
 * Step 4: Save holiday calendar
 */
export const saveHolidayCalendar = async (
  data: HolidayCalendarData,
): Promise<OnboardingSession> => {
  const response = await axiosInstance.post(
    api.onboarding.holidayCalendar,
    data,
  );
  return response.data;
};

/**
 * Step 5: Save time capture settings
 */
export const saveTimeCapture = async (
  data: TimeCaptureData,
): Promise<OnboardingSession> => {
  const response = await axiosInstance.post(api.onboarding.timeCapture, data);
  return response.data;
};

/**
 * Step 6: Complete onboarding
 */
export const completeOnboarding =
  async (): Promise<OnboardingCompleteResponse> => {
    const response = await axiosInstance.post(api.onboarding.complete);
    return response.data;
  };

/**
 * Navigate to a specific step
 */
export const goToStep = async (
  step: OnboardingStep,
): Promise<OnboardingSession> => {
  const response = await axiosInstance.patch(api.onboarding.goToStep(step));
  return response.data;
};

/**
 * Delete session and start over
 */
export const deleteSession = async (): Promise<void> => {
  await axiosInstance.delete(api.onboarding.deleteSession);
};

