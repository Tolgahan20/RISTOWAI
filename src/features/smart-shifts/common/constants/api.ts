const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

export const api = {
  baseUrl: BASE_URL,
  auth: {
    base: `${BASE_URL}/auth`,
    login: `${BASE_URL}/auth/login`,
    register: `${BASE_URL}/auth/register`,
    firebase: {
      login: `${BASE_URL}/auth/firebase/login`,
    },
    password: {
      forgot: `${BASE_URL}/auth/password/forgot`,
      reset: `${BASE_URL}/auth/password/reset`,
      verify: `${BASE_URL}/auth/password/verify-email`,
    },
    tokens: {
      refresh: `${BASE_URL}/auth/tokens/refresh`,
      revoke: `${BASE_URL}/auth/tokens/revoke`,
      revokeAll: `${BASE_URL}/auth/tokens/revoke-all`,
    },
  },
  onboarding: {
    start: `${BASE_URL}/api/onboarding/start`,
    session: `${BASE_URL}/api/onboarding/session`,
    venueInfo: `${BASE_URL}/api/onboarding/venue-info`,
    openingHours: `${BASE_URL}/api/onboarding/opening-hours`,
    workPhases: `${BASE_URL}/api/onboarding/work-phases`,
    staffImport: `${BASE_URL}/api/onboarding/staff-import`,
    holidayCalendar: `${BASE_URL}/api/onboarding/holiday-calendar`,
    timeCapture: `${BASE_URL}/api/onboarding/time-capture`,
    complete: `${BASE_URL}/api/onboarding/complete`,
    goToStep: (step: string) => `${BASE_URL}/api/onboarding/step/${step}`,
    deleteSession: `${BASE_URL}/api/onboarding/session`,
  },
  venues: {
    list: (restaurantId: string) => `${BASE_URL}/venues/${restaurantId}`,
    create: (restaurantId: string) => `${BASE_URL}/venues/${restaurantId}`,
    byId: (restaurantId: string, id: string) => `${BASE_URL}/venues/${restaurantId}/${id}`,
    withStaff: (restaurantId: string, id: string) => `${BASE_URL}/venues/${restaurantId}/${id}/with-staff`,
    withMembers: (restaurantId: string, id: string) => `${BASE_URL}/venues/${restaurantId}/${id}/with-members`,
  },
  aiScheduler: {
    generate: `${BASE_URL}/ai-scheduler/generate`,
    generateAsync: `${BASE_URL}/ai-scheduler/generate-async`,
    publish: `${BASE_URL}/ai-scheduler/publish`,
    job: (jobId: string) => `${BASE_URL}/ai-scheduler/job/${jobId}`,
    myJobs: `${BASE_URL}/ai-scheduler/my-jobs`,
  },
  schedules: {
    list: (venueId: string) => `${BASE_URL}/schedules/${venueId}`,
    byId: (venueId: string, scheduleId: string) => `${BASE_URL}/schedules/${venueId}/${scheduleId}`,
    weekly: (venueId: string, startDate: string) => `${BASE_URL}/schedules/${venueId}/weekly?startDate=${startDate}`,
    byStaff: (staffId: string) => `${BASE_URL}/schedules/staff/${staffId}`,
  },
} as const;
