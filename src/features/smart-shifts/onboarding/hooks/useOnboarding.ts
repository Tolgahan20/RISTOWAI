import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { AxiosError } from 'axios';
import * as onboardingApi from '../api';
import { useNotification } from '../../common/hooks/useNotification';
import { ONBOARDING_MESSAGES } from '../../common/constants/messages';
import { tokenService } from '../../auth/services/token.service';
import type {
  VenueInfoData,
  WorkPhasesData,
  StaffImportData,
  HolidayCalendarData,
  TimeCaptureData,
  OnboardingStep,
  OpeningHours,
} from '../types';

const QUERY_KEY = 'onboarding-session';

export const useOnboarding = () => {
  const router = useRouter();
  const { success, error: showError } = useNotification();
  const queryClient = useQueryClient();

  // Get current session
  const {
    data: session,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEY],
    queryFn: onboardingApi.getSession,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    staleTime: Infinity,
  });

  // Start onboarding
  const startMutation = useMutation({
    mutationFn: onboardingApi.startOnboarding,
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY], data);
      success(ONBOARDING_MESSAGES.START.SUCCESS);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const message =
        err.response?.data?.message || ONBOARDING_MESSAGES.START.ERROR;
      showError(message);
    },
  });

  // Save venue info
  const saveVenueInfoMutation = useMutation({
    mutationFn: (data: VenueInfoData) => onboardingApi.saveVenueInfo(data),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY], data);
      success(ONBOARDING_MESSAGES.VENUE_INFO.SUCCESS);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const message =
        err.response?.data?.message || ONBOARDING_MESSAGES.SAVE.ERROR;
      showError(message);
    },
  });

  // Save opening hours
  const saveOpeningHoursMutation = useMutation({
    mutationFn: (data: { openingHours?: OpeningHours }) => onboardingApi.saveOpeningHours(data),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY], data);
      success('Orari di apertura salvati');
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const message =
        err.response?.data?.message || ONBOARDING_MESSAGES.SAVE.ERROR;
      showError(message);
    },
  });

  // Save work phases
  const saveWorkPhasesMutation = useMutation({
    mutationFn: (data: WorkPhasesData) => onboardingApi.saveWorkPhases(data),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY], data);
      success(ONBOARDING_MESSAGES.WORK_PHASES.SUCCESS);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const message =
        err.response?.data?.message || ONBOARDING_MESSAGES.SAVE.ERROR;
      showError(message);
    },
  });

  // Save staff import
  const saveStaffImportMutation = useMutation({
    mutationFn: (data: StaffImportData) => onboardingApi.saveStaffImport(data),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY], data);
      success(ONBOARDING_MESSAGES.STAFF_IMPORT.SUCCESS);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const message =
        err.response?.data?.message || ONBOARDING_MESSAGES.SAVE.ERROR;
      showError(message);
    },
  });

  // Save holiday calendar
  const saveHolidayCalendarMutation = useMutation({
    mutationFn: (data: HolidayCalendarData) =>
      onboardingApi.saveHolidayCalendar(data),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY], data);
      success(ONBOARDING_MESSAGES.HOLIDAY_CALENDAR.SUCCESS);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const message =
        err.response?.data?.message || ONBOARDING_MESSAGES.SAVE.ERROR;
      showError(message);
    },
  });

  // Save time capture
  const saveTimeCaptureMutation = useMutation({
    mutationFn: (data: TimeCaptureData) => onboardingApi.saveTimeCapture(data),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY], data);
      success(ONBOARDING_MESSAGES.TIME_CAPTURE.SUCCESS);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const message =
        err.response?.data?.message || ONBOARDING_MESSAGES.SAVE.ERROR;
      showError(message);
    },
  });

  // Complete onboarding
  const completeMutation = useMutation({
    mutationFn: onboardingApi.completeOnboarding,
    onSuccess: () => {
      success('Onboarding completato! Reindirizziamo per aggiornare la tua sessione...');
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      
      // Clear tokens and redirect to login to get fresh token with restaurantId
      setTimeout(() => {
        tokenService.removeTokens();
        void router.push('/login');
      }, 2000);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const message =
        err.response?.data?.message || ONBOARDING_MESSAGES.COMPLETE.ERROR;
      showError(message);
    },
  });

  // Go to step
  const goToStepMutation = useMutation({
    mutationFn: (step: OnboardingStep) => onboardingApi.goToStep(step),
    onSuccess: (data) => {
      queryClient.setQueryData([QUERY_KEY], data);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const message =
        err.response?.data?.message || ONBOARDING_MESSAGES.SAVE.ERROR;
      showError(message);
    },
  });

  // Delete session
  const deleteSessionMutation = useMutation({
    mutationFn: onboardingApi.deleteSession,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: [QUERY_KEY] });
      void refetch();
    },
    onError: (err: AxiosError<{ message: string }>) => {
      const message =
        err.response?.data?.message || ONBOARDING_MESSAGES.SAVE.ERROR;
      showError(message);
    },
  });

  return {
    session,
    isLoading,
    error,
    refetch,
    start: startMutation.mutate,
    isStarting: startMutation.isPending,
    saveVenueInfo: saveVenueInfoMutation.mutate,
    isSavingVenueInfo: saveVenueInfoMutation.isPending,
    saveOpeningHours: saveOpeningHoursMutation.mutate,
    isSavingOpeningHours: saveOpeningHoursMutation.isPending,
    saveWorkPhases: saveWorkPhasesMutation.mutate,
    isSavingWorkPhases: saveWorkPhasesMutation.isPending,
    saveStaffImport: saveStaffImportMutation.mutate,
    isSavingStaffImport: saveStaffImportMutation.isPending,
    saveHolidayCalendar: saveHolidayCalendarMutation.mutate,
    isSavingHolidayCalendar: saveHolidayCalendarMutation.isPending,
    saveTimeCapture: saveTimeCaptureMutation.mutate,
    isSavingTimeCapture: saveTimeCaptureMutation.isPending,
    complete: completeMutation.mutate,
    isCompleting: completeMutation.isPending,
    goToStep: goToStepMutation.mutate,
    deleteSession: deleteSessionMutation.mutate,
  };
};

