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
    logout: `${BASE_URL}/auth/logout`,
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
    checkAvailability: `${BASE_URL}/ai-scheduler/check-availability`,
  },
  schedules: {
    list: (venueId: string) => `${BASE_URL}/schedules/${venueId}`,
    byId: (venueId: string, scheduleId: string) => `${BASE_URL}/schedules/${venueId}/${scheduleId}`,
    weekly: (venueId: string, startDate: string) => `${BASE_URL}/schedules/${venueId}/weekly?startDate=${startDate}`,
    byStaff: (staffId: string) => `${BASE_URL}/schedules/staff/${staffId}`,
  },
  staff: {
    list: (venueId: string, activeOnly?: boolean) => 
      `${BASE_URL}/staff/${venueId}${activeOnly ? '?activeOnly=true' : ''}`,
    create: (venueId: string) => `${BASE_URL}/staff/${venueId}`,
    byId: (venueId: string, staffId: string) => `${BASE_URL}/staff/${venueId}/${staffId}`,
    stats: (venueId: string) => `${BASE_URL}/staff/${venueId}/stats`,
    byRole: (venueId: string, role: string) => `${BASE_URL}/staff/${venueId}/by-role/${role}`,
    byContract: (venueId: string, contractType: string) => `${BASE_URL}/staff/${venueId}/by-contract/${contractType}`,
  },
  phases: {
    list: (venueId: string) => `${BASE_URL}/api/phases/${venueId}`,
    byId: (venueId: string, phaseId: string) => `${BASE_URL}/api/phases/${venueId}/${phaseId}`,
    stats: (venueId: string) => `${BASE_URL}/api/phases/${venueId}/stats`,
    overlaps: (venueId: string) => `${BASE_URL}/api/phases/${venueId}/overlaps`,
    byType: (venueId: string, type: string) => `${BASE_URL}/api/phases/${venueId}/type/${type}`,
    byDay: (venueId: string, day: number) => `${BASE_URL}/api/phases/${venueId}/day/${day}`,
    create: (venueId: string) => `${BASE_URL}/api/phases/${venueId}`,
    update: (venueId: string, phaseId: string) => `${BASE_URL}/api/phases/${venueId}/${phaseId}`,
    delete: (venueId: string, phaseId: string) => `${BASE_URL}/api/phases/${venueId}/${phaseId}`,
  },
  roles: {
    list: `${BASE_URL}/api/roles`,
    byId: (id: string) => `${BASE_URL}/api/roles/${id}`,
    create: `${BASE_URL}/api/roles`,
    update: (id: string) => `${BASE_URL}/api/roles/${id}`,
    delete: (id: string) => `${BASE_URL}/api/roles/${id}`,
    activate: (id: string) => `${BASE_URL}/api/roles/${id}/activate`,
    deactivate: (id: string) => `${BASE_URL}/api/roles/${id}/deactivate`,
  },
  absences: {
    list: (venueId: string) => `${BASE_URL}/absences/${venueId}`,
    byId: (venueId: string, id: string) => `${BASE_URL}/absences/${venueId}/${id}`,
    create: (venueId: string) => `${BASE_URL}/absences/${venueId}`,
    update: (venueId: string, id: string) => `${BASE_URL}/absences/${venueId}/${id}`,
    delete: (venueId: string, id: string) => `${BASE_URL}/absences/${venueId}/${id}`,
    approve: (venueId: string, id: string) => `${BASE_URL}/absences/${venueId}/${id}/approve`,
    reject: (venueId: string, id: string) => `${BASE_URL}/absences/${venueId}/${id}/reject`,
    stats: (venueId: string) => `${BASE_URL}/absences/${venueId}/stats`,
  },
  requests: {
    list: (venueId: string) => `${BASE_URL}/requests/${venueId}`,
    byId: (venueId: string, id: string) => `${BASE_URL}/requests/${venueId}/${id}`,
    create: (venueId: string) => `${BASE_URL}/requests/${venueId}`,
    update: (venueId: string, id: string) => `${BASE_URL}/requests/${venueId}/${id}`,
    delete: (venueId: string, id: string) => `${BASE_URL}/requests/${venueId}/${id}`,
    approve: (venueId: string, id: string) => `${BASE_URL}/requests/${venueId}/${id}/approve`,
    reject: (venueId: string, id: string) => `${BASE_URL}/requests/${venueId}/${id}/reject`,
    cancel: (venueId: string, id: string) => `${BASE_URL}/requests/${venueId}/${id}/cancel`,
    stats: (venueId: string) => `${BASE_URL}/requests/${venueId}/stats`,
  },
  shiftSnapshots: {
    base: `${BASE_URL}/shift-snapshots`,
    list: (venueId: string) => `${BASE_URL}/shift-snapshots/venue/${venueId}`,
    byId: (id: string) => `${BASE_URL}/shift-snapshots/${id}`,
    history: (id: string) => `${BASE_URL}/shift-snapshots/${id}/history`,
    staffShifts: (id: string, staffId: string) => `${BASE_URL}/shift-snapshots/${id}/staff/${staffId}`,
    publish: (id: string) => `${BASE_URL}/shift-snapshots/${id}/publish`,
    lock: (id: string) => `${BASE_URL}/shift-snapshots/${id}/lock`,
    archive: (id: string) => `${BASE_URL}/shift-snapshots/${id}/archive`,
  },

  timeBank: {
    policy: {
      create: `${BASE_URL}/balance-policies`,
      byVenue: (venueId: string) => `${BASE_URL}/balance-policies/venue/${venueId}`,
      byId: (id: string) => `${BASE_URL}/balance-policies/${id}`,
      update: (id: string) => `${BASE_URL}/balance-policies/${id}`,
      delete: (id: string) => `${BASE_URL}/balance-policies/${id}`,
    },
    balance: {
      view: `${BASE_URL}/balances/view`,
      recalculate: `${BASE_URL}/balances/recalculate`,
      warning: `${BASE_URL}/balances/warning`,
    },
    adjustment: {
      create: `${BASE_URL}/manual-adjustments`,
      byStaff: (staffId: string) => `${BASE_URL}/manual-adjustments/staff/${staffId}`,
      byStaffAndBucket: (staffId: string, bucket: string) =>
        `${BASE_URL}/manual-adjustments/staff/${staffId}/bucket/${bucket}`,
      byVenue: (venueId: string) => `${BASE_URL}/manual-adjustments/venue/${venueId}`,
    },
  },

  exports: {
    validate: `${BASE_URL}/exports/validate`,
    create: `${BASE_URL}/exports`,
    byVenue: (venueId: string) => `${BASE_URL}/exports/venue/${venueId}`,
    byId: (id: string) => `${BASE_URL}/exports/${id}`,
    download: (id: string) => `${BASE_URL}/exports/${id}/download`,
    delete: (id: string) => `${BASE_URL}/exports/${id}`,
  },

  weeklyAdmin: {
    getData: (venueId: string) => `${BASE_URL}/weekly-admin/${venueId}`,
    resolveAnomaly: (venueId: string, timeEventId: string) => 
      `${BASE_URL}/weekly-admin/${venueId}/anomalies/${timeEventId}/resolve`,
    approveExtraHours: (venueId: string) => 
      `${BASE_URL}/weekly-admin/${venueId}/extra-hours/approve`,
    lockWeek: (venueId: string) => `${BASE_URL}/weekly-admin/${venueId}/lock`,
    unlockWeek: (venueId: string) => `${BASE_URL}/weekly-admin/${venueId}/unlock`,
  },

  dashboard: {
    kpis: `${BASE_URL}/dashboard/kpis`,
  },

  incidents: {
    list: `${BASE_URL}/incidents`,
    create: `${BASE_URL}/incidents`,
    getById: (id: string) => `${BASE_URL}/incidents/${id}`,
    update: (id: string) => `${BASE_URL}/incidents/${id}`,
    resolve: (id: string) => `${BASE_URL}/incidents/${id}/resolve`,
    close: (id: string) => `${BASE_URL}/incidents/${id}/close`,
    delete: (id: string) => `${BASE_URL}/incidents/${id}`,
    stats: `${BASE_URL}/incidents/stats`,
  },
} as const;
  