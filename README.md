# Ristowai Smart Shifts - Frontend Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Architecture](#project-architecture)
- [Feature Modules](#feature-modules)
- [Component Hierarchy](#component-hierarchy)
- [State Management](#state-management)
- [Routing & Navigation](#routing--navigation)
- [API Integration](#api-integration)
- [Styling & Design System](#styling--design-system)
- [Development Setup](#development-setup)
- [Key Implementation Details](#key-implementation-details)

---

## Overview

The Ristowai Smart Shifts frontend is a modern, responsive React application built with Next.js 14. It provides an intuitive interface for restaurant managers to:

- **Generate AI-powered schedules** with visual phase coverage
- **Manage staff** with contract tracking and alerts
- **Configure venues** with opening hours and WhatsApp settings
- **Review and publish** schedules with labor law warnings
- **Track absence requests** and shift swaps
- **Monitor job history** and republish past schedules

### Design Philosophy
- **Manager-first UX** - Optimize for speed and clarity
- **Visual feedback** - Instant validation, clear error states
- **Mobile-ready** - Responsive design for on-the-go management
- **Progressive enhancement** - Features load incrementally

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Next.js** | 14.x (App Router) | React framework with SSR/SSG |
| **React** | 18.x | UI library |
| **TypeScript** | 5.x | Type safety |
| **Zustand** | ^4.x | Lightweight state management |
| **React Query** | ^5.x | Server state & caching |
| **CSS Modules** | Built-in | Component-scoped styling |
| **React Feather** | ^2.x | Icon library |
| **date-fns** | ^3.x | Date manipulation |
| **Axios** | ^1.x | HTTP client |

---

## Project Architecture

### Directory Structure

```
frontend/
├── public/                          # Static assets
├── src/
│   ├── app/                         # Next.js App Router pages
│   │   ├── dashboard/
│   │   │   ├── smart-shifts/        # Main app routes
│   │   │   │   ├── page.tsx         # Dashboard home
│   │   │   │   ├── ai-scheduler/    # AI scheduling wizard
│   │   │   │   ├── venues/          # Venue management
│   │   │   │   │   └── [venueId]/   # Venue detail (dynamic route)
│   │   │   │   ├── staff/           # Staff management
│   │   │   │   ├── phases/          # Work phases setup
│   │   │   │   ├── schedules/       # Schedule list & detail
│   │   │   │   ├── absences/        # Absence requests
│   │   │   │   ├── requests/        # Swap requests (v2)
│   │   │   │   └── exports/         # Export page (v2)
│   │   │   └── layout.tsx           # Dashboard layout
│   │   ├── login/                   # Auth pages
│   │   └── layout.tsx               # Root layout
│   │
│   ├── features/                    # Feature modules (domain-driven)
│   │   └── smart-shifts/
│   │       ├── ai-scheduler/        # AI scheduling feature
│   │       │   ├── components/
│   │       │   │   ├── ScheduleGenerator/      # Main wizard container
│   │       │   │   ├── ScheduleForm/           # Step 1: Date & mode selection
│   │       │   │   ├── StaffAvailability/      # Step 2: Staff review
│   │       │   │   ├── ScheduleResults/        # Step 3: Review & publish
│   │       │   │   └── JobHistory/             # Cronologia (job history)
│   │       │   ├── hooks/
│   │       │   │   ├── useScheduleGenerator.ts # Main orchestration hook
│   │       │   │   ├── usePublishSchedule.ts   # Publish mutation
│   │       │   │   └── useJobHistory.ts        # Job list fetching
│   │       │   ├── api/             # API client functions
│   │       │   └── types/           # TypeScript interfaces
│   │       │
│   │       ├── staff/               # Staff management feature
│   │       │   ├── components/
│   │       │   │   ├── StaffTable/             # Staff list with filters
│   │       │   │   ├── StaffForm/              # Create/edit form
│   │       │   │   └── StaffCard/              # Staff detail card
│   │       │   ├── hooks/
│   │       │   │   ├── useStaffTable.ts        # Table state & actions
│   │       │   │   └── useStaffForm.ts         # Form validation & submission
│   │       │   ├── api/
│   │       │   └── types/
│   │       │
│   │       ├── venues/              # Venue management
│   │       │   ├── components/
│   │       │   │   ├── VenueCard/              # Venue grid card
│   │       │   │   ├── VenueForm/              # Create/edit with WhatsApp settings
│   │       │   │   └── VenueDetail/            # Venue detail page
│   │       │   ├── hooks/
│   │       │   │   └── useVenueForm.ts         # Form state with WhatsApp settings
│   │       │   ├── api/
│   │       │   └── types/
│   │       │
│   │       ├── phases/              # Work phases
│   │       │   ├── components/
│   │       │   │   ├── PhaseList/              # Phase cards
│   │       │   │   ├── PhaseForm/              # Create/edit phase
│   │       │   │   └── PhasePresets/           # Industry templates
│   │       │   ├── hooks/
│   │       │   ├── api/
│   │       │   └── types/
│   │       │
│   │       ├── contract-alerts/     # Contract expiration alerts
│   │       │   ├── components/
│   │       │   │   ├── ContractAlertBadge/     # Alert count badge
│   │       │   │   └── ContractAlertsPanel/    # Alert modal
│   │       │   ├── hooks/
│   │       │   │   └── useContractAlerts.ts    # Fetch & manage alerts
│   │       │   ├── api/
│   │       │   └── types/
│   │       │
│   │       ├── absences/            # Absence management
│   │       ├── schedules/           # Schedule viewing
│   │       └── common/              # Shared utilities
│   │           ├── components/      # Shared UI components
│   │           ├── constants/       # API endpoints, enums
│   │           └── utils/           # Helper functions
│   │
│   ├── stores/                      # Zustand state stores
│   │   ├── authStore.ts             # User authentication state
│   │   ├── notificationStore.ts     # Toast notifications
│   │   └── restaurantStore.ts       # Current restaurant context
│   │
│   ├── types/                       # Global TypeScript types
│   ├── lib/                         # Utility libraries
│   └── styles/                      # Global styles & CSS variables
│       └── globals.css
│
├── next.config.js
├── tsconfig.json
└── package.json
```

---

## Feature Modules

### 1. AI Scheduler Module

**Path**: `src/features/smart-shifts/ai-scheduler/`

**Purpose**: Intelligent schedule generation with OpenAI integration.

#### Components

##### **ScheduleGenerator** (Main Container)
- 3-step wizard: Form → Availability → Results
- Step state management
- Orchestrates data flow between steps
- Handles loading, error, and success states

**Props**: None (uses internal state + hooks)

**State Flow**:
```
Step 1: ScheduleForm (date range, mode) → formData
  ↓
Step 2: StaffAvailability (review staff) → staffAvailability
  ↓
Step 3: ScheduleResults (review shifts) → schedule
  ↓
Publish → API call → Redirect to schedule detail
```

---

##### **ScheduleForm** (Step 1)
**File**: `components/ScheduleForm/index.tsx`

**Features**:
- Date range picker (start/end date)
- AI mode selection (COVERAGE, COST_HINT, SEED_AND_FILL)
- Constraint inputs (min rest hours, max daily hours)
- Seed schedule upload (optional, for SEED_AND_FILL mode)

**State**:
```typescript
interface FormData {
  dateRange: { startDate: string; endDate: string };
  mode: AiMode;
  constraints: {
    minRestHours: number;
    maxDailyHours: number;
  };
  seedSchedule?: SeedShift[];
}
```

**Validation**:
- Start date < end date
- Date range ≤ 31 days (MVP limit)
- Min rest hours ≥ 8, ≤ 12
- Max daily hours ≥ 8, ≤ 16

---

##### **StaffAvailability** (Step 2)
**File**: `components/StaffAvailability/index.tsx`

**Features**:
- Displays available vs unavailable staff
- Shows absences and reasons
- Color-coded availability status
- Staff count summary

**API**: `GET /ai-scheduler/availability/:venueId?startDate=...&endDate=...`

**Response**:
```typescript
{
  staff: Array<{
    staffId: string;
    name: string;
    role: string;
    weeklyHours: number;
    isAvailable: boolean;
    unavailabilityReason?: string;
    absences: Array<{
      startDate: string;
      endDate: string;
      reason: string;
    }>;
  }>;
  totalStaff: number;
  availableCount: number;
  unavailableCount: number;
}
```

---

##### **ScheduleResults** (Step 3)
**File**: `components/ScheduleResults/index.tsx`

**Features**:
- Timeline view of shifts (color-coded by role/phase)
- AI reasoning display
- Labor law warnings (prominent with icons)
- WhatsApp notification toggle (if venue has WhatsApp enabled)
- Estimated hours & cost
- Publish button with loading state

**Props**:
```typescript
{
  schedule: ScheduleResponse;
  onBack: () => void;
  onPublish: (sendWhatsApp: boolean) => void;
  isPublishing: boolean;
  whatsAppEnabled: boolean; // From venue settings
}
```

**Warnings Display**:
```typescript
{violations?.length > 0 && (
  <div className={styles.warnings}>
    <AlertTriangle className={styles.warningIcon} />
    <div className={styles.warningContent}>
      <h4>Avvisi di Conformità</h4>
      <p>Le seguenti criticità richiedono revisione manageriale...</p>
      <ul>
        {violations.map((v, i) => (
          <li key={i}>{v}</li>
        ))}
      </ul>
    </div>
  </div>
)}
```

---

##### **JobHistory** (Cronologia)
**File**: `components/JobHistory/index.tsx`

**Features**:
- List of past AI generation jobs
- Filter by venue, status, date
- View past schedules
- **Publish past schedules** (with WhatsApp option)

**Key Implementation**:
```typescript
const handlePublish = (sendWhatsApp: boolean = false) => {
  if (!selectedSchedule || !selectedJob?.request) return;

  const shiftsToPublish: ShiftToPublish[] = selectedSchedule.shifts.map((shift) => ({
    staffId: shift.staffId,
    phaseId: shift.phaseId,
    startTime: shift.startTime,
    endTime: shift.endTime,
  }));

  const publishRequest: PublishScheduleRequest = {
    venueId: selectedJob.request.venueId,
    startDate: selectedJob.request.dateRange.startDate,
    endDate: selectedJob.request.dateRange.endDate,
    shifts: shiftsToPublish,
    aiReasoning: selectedSchedule.metadata.aiReasoning,
    aiMode: selectedSchedule.metadata.mode,
    sendWhatsApp,
  };

  publishSchedule(publishRequest);
};
```

---

#### Hooks

##### **useScheduleGenerator**
**File**: `hooks/useScheduleGenerator.ts`

**Purpose**: Orchestrates the entire scheduling wizard flow.

**State**:
```typescript
{
  step: 1 | 2 | 3;
  formData: FormData;
  staffAvailability: StaffAvailabilityResponse | null;
  schedule: ScheduleResponse | null;
  isGenerating: boolean;
  error: string | null;
}
```

**Methods**:
```typescript
{
  handleFormSubmit: (data: FormData) => void;           // Step 1 → 2
  handleAvailabilityNext: () => void;                   // Step 2 → 3 (generate)
  handlePublish: (sendWhatsApp: boolean) => void;       // Step 3 → Publish
  goBack: () => void;                                   // Navigate back
  resetWizard: () => void;                              // Start over
}
```

**Integration**:
- Fetches venue details (for WhatsApp settings)
- Calls `generateSchedule` mutation (React Query)
- Calls `publishSchedule` mutation
- Redirects to `/dashboard/smart-shifts/schedules/:venueId/:scheduleId` on success

---

##### **usePublishSchedule**
**File**: `hooks/usePublishSchedule.ts`

**Purpose**: Mutation hook for publishing schedules.

**Usage**:
```typescript
const { publishSchedule, isPublishing } = usePublishSchedule({
  onSuccess: (data) => {
    showNotification({ type: 'success', message: 'Schedule published!' });
    router.push(`/dashboard/smart-shifts/schedules/${venueId}/${data.scheduleId}`);
  },
  onError: (error) => {
    showNotification({ type: 'error', message: error });
  },
});
```

**API**: `POST /ai-scheduler/publish`

---

##### **useJobHistory**
**File**: `hooks/useJobHistory.ts`

**Purpose**: Fetches job history with filters.

**Filters**:
```typescript
{
  venueId?: string;
  status?: 'COMPLETED' | 'FAILED' | 'PROCESSING';
  startDate?: string;
  endDate?: string;
  limit?: number; // Default 20
}
```

**Returns**: React Query result with `data: JobStatusResponse[]`

---

### 2. Staff Module

**Path**: `src/features/smart-shifts/staff/`

#### Components

##### **StaffTable**
**File**: `components/StaffTable/index.tsx`

**Features**:
- Sortable columns (name, role, contract type, hire date)
- Search by name/role
- Filter by venue, contract type, status
- Pagination
- Actions: Edit, View Schedule, Delete

**State**: Managed by `useStaffTable` hook

---

##### **StaffForm**
**File**: `components/StaffForm/index.tsx`

**Features**:
- **Create mode**: Asks for full name, email, phone
- **Edit mode**: Staff edits their own info (no personal fields)
- Contract details (type, weekly hours, hourly rate, CCNL level)
- Hire date & end date (with validation)
- Skills & availability (JSON)

**Validation**:
- Email format (optional)
- Phone format (optional, E.164)
- End date > hire date (frontend + backend)
- Codice fiscale format (Italian tax code)

**Key Implementation**:
```typescript
// In useStaffForm.ts
const validateEndDate = () => {
  if (formData.endDate && formData.hireDate) {
    if (new Date(formData.endDate) <= new Date(formData.hireDate)) {
      setErrors({ ...errors, endDate: 'End date must be after hire date' });
      return false;
    }
  }
  return true;
};
```

---

#### Hooks

##### **useStaffForm**
**File**: `hooks/useStaffForm.ts`

**Purpose**: Manages staff form state, validation, and submission.

**State**:
```typescript
{
  formData: CreateStaffRequest | UpdateStaffRequest;
  errors: Record<string, string>;
  isSubmitting: boolean;
}
```

**Methods**:
```typescript
{
  handleChange: (field: string, value: any) => void;
  handleSubmit: () => Promise<void>;
  resetForm: () => void;
}
```

---

### 3. Venues Module

**Path**: `src/features/smart-shifts/venues/`

#### Components

##### **VenueCard**
**File**: `components/VenueCard/index.tsx`

**Features**:
- Venue thumbnail (icon based on type)
- Name, address, type badge
- Staff count
- Quick actions: View Details, Edit, Delete

**Click Handler**:
```typescript
const handleViewDetails = () => {
  router.push(`/dashboard/smart-shifts/venues/${venue.id}`);
};
```

---

##### **VenueForm**
**File**: `components/VenueForm/index.tsx`

**Features**:
- Basic info (name, address, timezone, type)
- Opening hours (per day of week)
- Settings (min rest hours, max daily hours, break duration)
- **WhatsApp Settings Section**:
  - Enable/disable toggle
  - Manager phone input
  - Notification type checkboxes (shift assignments, schedule published, shift changes)

**WhatsApp Section UI**:
```typescript
<section className={styles.section}>
  <h3>Notifiche WhatsApp</h3>
  
  <div className={styles.formGroup}>
    <label>
      <input
        type="checkbox"
        checked={formData.settings.whatsapp?.enabled || false}
        onChange={(e) => updateWhatsAppSettings('enabled', e.target.checked)}
      />
      Abilita notifiche WhatsApp
    </label>
  </div>
  
  {formData.settings.whatsapp?.enabled && (
    <>
      <div className={styles.formGroup}>
        <label>Numero Telefono Manager</label>
        <input
          type="tel"
          placeholder="+39 320 1234567"
          value={formData.settings.whatsapp.managerPhone || ''}
          onChange={(e) => updateWhatsAppSettings('managerPhone', e.target.value)}
        />
      </div>
      
      <div className={styles.checkboxGroup}>
        <label>
          <input type="checkbox" 
            checked={formData.settings.whatsapp.sendShiftAssignments || false}
            onChange={(e) => updateWhatsAppSettings('sendShiftAssignments', e.target.checked)}
          />
          Invia assegnazioni turni
        </label>
        {/* ... more checkboxes */}
      </div>
    </>
  )}
</section>
```

---

#### Hooks

##### **useVenueForm**
**File**: `hooks/useVenueForm.ts`

**Key Method**:
```typescript
const updateWhatsAppSettings = (key: keyof WhatsAppSettings, value: any) => {
  setFormData({
    ...formData,
    settings: {
      ...formData.settings,
      whatsapp: {
        ...formData.settings.whatsapp,
        [key]: value,
      },
    },
  });
};
```

---

### 4. Contract Alerts Module

**Path**: `src/features/smart-shifts/contract-alerts/`

#### Components

##### **ContractAlertBadge**
**File**: `components/ContractAlertBadge/index.tsx`

**Features**:
- Floating badge on dashboard
- Displays pending alert count
- Pulsing animation for critical alerts
- Click opens `ContractAlertsPanel`

**Styling**:
```css
.badge {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: var(--color-warning);
  color: white;
  padding: 1rem 1.5rem;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 100;
}

.badge.critical {
  background: var(--color-danger);
  animation: pulse 2s infinite;
}
```

---

##### **ContractAlertsPanel**
**File**: `components/ContractAlertsPanel/index.tsx`

**Features**:
- Modal overlay
- Filterable alert list (severity, status)
- Alert cards with staff info
- Actions: Acknowledge, Resolve
- Close button (react-feather `X` icon)

**Alert Item**:
```typescript
<div className={styles.alertItem}>
  <div className={styles.alertHeader}>
    {alert.severity === 'CRITICAL' ? (
      <AlertCircle className={styles.criticalIcon} />
    ) : (
      <AlertTriangle className={styles.warningIcon} />
    )}
    <h4>{alert.staff.firstName} {alert.staff.lastName}</h4>
  </div>
  <p>{alert.message}</p>
  <div className={styles.alertActions}>
    {alert.status === 'PENDING' && (
      <button onClick={() => handleAcknowledge(alert.id)}>
        Conferma
      </button>
    )}
    <button onClick={() => handleResolve(alert.id)}>
      Risolvi
    </button>
  </div>
</div>
```

---

#### Hooks

##### **useContractAlerts**
**File**: `hooks/useContractAlerts.ts`

**Returns**:
```typescript
{
  data: ContractAlert[];
  count: number; // Pending count
  isLoading: boolean;
  acknowledgeAlert: (id: string) => Promise<void>;
  resolveAlert: (id: string) => Promise<void>;
  refetch: () => void;
}
```

**Usage**:
```typescript
const { data: alerts, count, acknowledgeAlert } = useContractAlerts(venueId);

// Badge shows count
<ContractAlertBadge count={count} onClick={openPanel} />
```

---

### 5. Phases Module

**Path**: `src/features/smart-shifts/phases/`

#### Components

##### **PhaseList**
**Features**:
- Cards for each phase
- Visual timeline (start → end)
- HARD/SOFT badge
- Role requirements display
- Active/inactive toggle

##### **PhaseForm**
**Features**:
- Name, start/end time pickers
- Type selector (HARD/SOFT)
- Role requirements builder (dynamic add/remove)
- Days of week selector
- Priority input

##### **PhasePresets**
**Features**:
- Industry templates (Trattoria, Pizzeria, Bar, etc.)
- One-click apply preset
- Customizable after apply

**Preset Example**:
```typescript
const TRATTORIA_PRESET = [
  { name: 'Colazione', startTime: '07:00', endTime: '11:00', type: 'SOFT', roles: [...] },
  { name: 'Pranzo', startTime: '12:00', endTime: '15:00', type: 'HARD', roles: [...] },
  { name: 'Cena', startTime: '19:00', endTime: '23:00', type: 'HARD', roles: [...] },
];
```

---

## Component Hierarchy

### Dashboard Layout
```
app/dashboard/smart-shifts/layout.tsx
├─> Sidebar (navigation)
├─> Header (restaurant selector, user menu)
└─> Content area
    └─> {children} (page content)
```

### AI Scheduler Page
```
app/dashboard/smart-shifts/ai-scheduler/page.tsx
└─> ScheduleGenerator
    ├─> Step 1: ScheduleForm
    ├─> Step 2: StaffAvailability
    └─> Step 3: ScheduleResults
        ├─> ShiftTimeline
        ├─> AIReasoningCard
        ├─> LaborLawWarnings
        └─> WhatsAppToggle (if enabled)
```

### Dashboard Home
```
app/dashboard/smart-shifts/page.tsx
├─> VenueSelector (dropdown)
├─> QuickActions (buttons: New Schedule, Manage Staff, etc.)
├─> UpcomingSchedules (cards)
├─> ContractAlertBadge (floating)
└─> ContractAlertsPanel (modal, conditional)
```

---

## State Management

### Zustand Stores

#### **authStore**
**File**: `src/stores/authStore.ts`

**State**:
```typescript
{
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
```

**Actions**:
```typescript
{
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
  refreshToken: () => Promise<void>;
}
```

**Persistence**: Token stored in `localStorage`, auto-restored on app load.

---

#### **notificationStore**
**File**: `src/stores/notificationStore.ts`

**State**:
```typescript
{
  notifications: Array<{
    id: string;
    type: 'success' | 'error' | 'warning' | 'info';
    message: string;
    duration?: number;
  }>;
}
```

**Actions**:
```typescript
{
  showNotification: (notification: Omit<Notification, 'id'>) => void;
  dismissNotification: (id: string) => void;
  clearAll: () => void;
}
```

**Usage**:
```typescript
const { showNotification } = useNotificationStore();

showNotification({
  type: 'success',
  message: 'Schedule published successfully!',
  duration: 5000, // Auto-dismiss after 5s
});
```

---

#### **restaurantStore**
**File**: `src/stores/restaurantStore.ts`

**State**:
```typescript
{
  currentRestaurantId: string | null;
  venues: Venue[];
  selectedVenueId: string | null;
}
```

**Actions**:
```typescript
{
  setRestaurant: (id: string) => void;
  setVenues: (venues: Venue[]) => void;
  selectVenue: (id: string) => void;
}
```

**Purpose**: Maintains context for multi-venue navigation and filters.

---

## Routing & Navigation

### Next.js App Router Structure

```
/dashboard/smart-shifts/
├─ / (page.tsx)                          → Dashboard home
├─ /ai-scheduler                         → AI scheduler wizard
├─ /venues                               → Venue list
│  └─ /[venueId]                         → Venue detail (dynamic)
├─ /staff                                → Staff list
│  └─ /[staffId]/schedule                → Staff schedule view
├─ /phases                               → Work phases setup
├─ /schedules                            → Schedules overview
│  ├─ /list                              → All schedules list
│  └─ /[venueId]/[scheduleId]            → Schedule detail
├─ /absences                             → Absence requests
├─ /requests                             → Swap requests (v2)
└─ /exports                              → Export page (v2)
```

### Route Guards

**File**: `app/dashboard/layout.tsx`

```typescript
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <div className={styles.layout}>
      <Sidebar />
      <main className={styles.content}>{children}</main>
    </div>
  );
}
```

---

### Navigation Helpers

**File**: `src/lib/navigation.ts`

```typescript
export const ROUTES = {
  dashboard: '/dashboard/smart-shifts',
  aiScheduler: '/dashboard/smart-shifts/ai-scheduler',
  venues: '/dashboard/smart-shifts/venues',
  venueDetail: (venueId: string) => `/dashboard/smart-shifts/venues/${venueId}`,
  staff: '/dashboard/smart-shifts/staff',
  staffSchedule: (staffId: string) => `/dashboard/smart-shifts/staff/${staffId}/schedule`,
  schedules: '/dashboard/smart-shifts/schedules',
  scheduleDetail: (venueId: string, scheduleId: string) => 
    `/dashboard/smart-shifts/schedules/${venueId}/${scheduleId}`,
};

// Usage
router.push(ROUTES.venueDetail(venueId));
```

---

## API Integration

### API Client Setup

**File**: `src/lib/apiClient.ts`

```typescript
import axios from 'axios';
import { useAuthStore } from '@/stores/authStore';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Attach JWT token
apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor: Handle 401 (auto-logout)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

### API Constants

**File**: `src/features/smart-shifts/common/constants/api.ts`

```typescript
export const API_ENDPOINTS = {
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  me: '/auth/me',
  
  // AI Scheduler
  generateSchedule: '/ai-scheduler/generate',
  publishSchedule: '/ai-scheduler/publish',
  checkAvailability: (venueId: string) => `/ai-scheduler/availability/${venueId}`,
  jobHistory: '/ai-scheduler/jobs',
  
  // Staff
  staff: '/staff',
  staffById: (id: string) => `/staff/${id}`,
  
  // Venues
  venues: '/venues',
  venueById: (id: string) => `/venues/${id}`,
  
  // Contract Alerts
  contractAlerts: (venueId: string) => `/contract-alerts/venue/${venueId}`,
  contractAlertCount: (venueId: string) => `/contract-alerts/venue/${venueId}/count`,
  acknowledgeAlert: (id: string) => `/contract-alerts/${id}/acknowledge`,
  resolveAlert: (id: string) => `/contract-alerts/${id}/resolve`,
  
  // Phases
  phases: '/phases',
  phaseById: (id: string) => `/phases/${id}`,
  
  // Absences
  absences: '/absences',
  absenceById: (id: string) => `/absences/${id}`,
  approveAbsence: (id: string) => `/absences/${id}/approve`,
  
  // Schedules
  schedules: '/schedules',
  scheduleById: (id: string) => `/schedules/${id}`,
};
```

---

### React Query Integration

**File**: `src/app/providers.tsx`

```typescript
'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
```

---

### Example API Hook

**File**: `src/features/smart-shifts/venues/hooks/useVenues.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { fetchVenues } from '../api/venuesApi';
import { useRestaurantId } from '@/hooks/useRestaurantId';

export const useVenues = () => {
  const restaurantId = useRestaurantId();
  
  return useQuery({
    queryKey: ['venues', restaurantId],
    queryFn: () => fetchVenues(restaurantId),
    enabled: !!restaurantId,
  });
};
```

**API Function**:
```typescript
// src/features/smart-shifts/venues/api/venuesApi.ts
import apiClient from '@/lib/apiClient';
import { API_ENDPOINTS } from '../../common/constants/api';
import { Venue } from '../types';

export const fetchVenues = async (restaurantId: string): Promise<Venue[]> => {
  const response = await apiClient.get(API_ENDPOINTS.venues, {
    params: { restaurantId },
  });
  return response.data;
};
```

---

## Styling & Design System

### Global CSS Variables

**File**: `src/styles/globals.css`

```css
:root {
  /* Colors */
  --color-primary: #2563eb;       /* Blue */
  --color-secondary: #10b981;     /* Green */
  --color-danger: #ef4444;        /* Red */
  --color-warning: #f59e0b;       /* Amber */
  --color-info: #3b82f6;          /* Light blue */
  
  /* Grays */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-700: #374151;
  --color-gray-900: #111827;
  
  /* Typography */
  --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  --font-mono: 'Fira Code', 'Courier New', monospace;
  
  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  
  /* Border Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;
  
  /* Shadows */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}
```

---

### CSS Modules Pattern

**Example**: `components/Button/button.module.css`

```css
.button {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
}

.button.primary {
  background: var(--color-primary);
  color: white;
}

.button.primary:hover {
  background: #1d4ed8; /* Darker blue */
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

**Usage**:
```tsx
import styles from './button.module.css';

<button className={`${styles.button} ${styles.primary}`}>
  Click Me
</button>
```

---

### Responsive Design

**Breakpoints** (defined in globals.css):
```css
/* Mobile-first approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
```

**Example**:
```css
.container {
  padding: var(--spacing-md);
}

@media (min-width: 768px) {
  .container {
    padding: var(--spacing-xl);
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

---

### Icon Usage (react-feather)

**Available Icons**:
- `AlertTriangle` - Warnings
- `AlertCircle` - Critical alerts
- `Info` - Information
- `X` - Close buttons
- `Check` - Success
- `Calendar` - Dates
- `Users` - Staff
- `Clock` - Time

**Example**:
```tsx
import { AlertTriangle } from 'react-feather';

<AlertTriangle 
  size={20} 
  color="var(--color-warning)" 
  className={styles.icon} 
/>
```

---

## Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with API URL
echo "NEXT_PUBLIC_API_URL=http://localhost:3000" > .env.local

# Start development server
npm run dev
```

### Environment Variables

**File**: `.env.local`

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000

# Optional: Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

---

### Running the App

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build
npm start

# Lint
npm run lint

# Type check
npm run type-check
```

---

## Key Implementation Details

### 1. AI Scheduler Wizard Flow

**Challenge**: Multi-step form with async operations between steps.

**Solution**: Centralized state in `useScheduleGenerator` hook.

**Flow**:
```typescript
// Step 1 → 2
handleFormSubmit(formData) → 
  Store formData → 
  Fetch availability (async) → 
  setStep(2)

// Step 2 → 3
handleAvailabilityNext() → 
  Call generateSchedule API (async) → 
  Store schedule → 
  setStep(3)

// Step 3 → Publish
handlePublish(sendWhatsApp) → 
  Call publishSchedule API (async) → 
  Show success notification → 
  Redirect to schedule detail
```

**Error Handling**: Each async operation wrapped in try-catch, errors stored in state and displayed in UI.

---

### 2. WhatsApp Integration UX

**Challenge**: Only show WhatsApp options if venue has it enabled.

**Solution**:
1. Fetch venue details when loading AI scheduler
2. Extract `venue.settings.whatsapp.enabled`
3. Pass `whatsAppEnabled` prop to `ScheduleResults`
4. Conditionally render checkbox

**Code**:
```typescript
// In useScheduleGenerator.ts
const { data: venue } = useVenueDetail(restaurantId, venueId);
const whatsAppEnabled = venue?.settings?.whatsapp?.enabled || false;

// In ScheduleGenerator component
<ScheduleResults 
  schedule={schedule}
  onPublish={handlePublish}
  whatsAppEnabled={whatsAppEnabled}
/>

// In ScheduleResults component
{whatsAppEnabled && (
  <div className={styles.whatsappSection}>
    <label>
      <input
        type="checkbox"
        checked={sendWhatsApp}
        onChange={(e) => setSendWhatsApp(e.target.checked)}
      />
      Invia notifiche WhatsApp al personale
    </label>
  </div>
)}
```

---

### 3. Contract Alerts Real-time Updates

**Challenge**: Show badge count immediately after manager acknowledges/resolves alert.

**Solution**: React Query cache invalidation.

**Code**:
```typescript
// In useContractAlerts.ts
const queryClient = useQueryClient();

const acknowledgeAlert = async (id: string) => {
  await apiClient.patch(API_ENDPOINTS.acknowledgeAlert(id));
  
  // Invalidate queries to refetch
  queryClient.invalidateQueries(['contractAlerts', venueId]);
  queryClient.invalidateQueries(['contractAlertCount', venueId]);
};
```

**Result**: Badge count updates instantly without full page reload.

---

### 4. Staff Form Mode Switching

**Challenge**: Different fields for create vs edit mode.

**Solution**: Conditional rendering based on `mode` prop.

**Code**:
```tsx
<StaffForm mode={isEditing ? 'edit' : 'create'} staff={selectedStaff} />

// Inside StaffForm
{mode === 'create' && (
  <>
    <input name="firstName" placeholder="Nome" required />
    <input name="lastName" placeholder="Cognome" required />
    <input name="email" placeholder="Email" type="email" />
    <input name="phone" placeholder="Telefono" type="tel" />
  </>
)}

{/* Contract fields shown in both modes */}
<input name="contractType" placeholder="Tipo Contratto" required />
<input name="weeklyHours" placeholder="Ore Settimanali" type="number" required />
```

---

### 5. Labor Law Warnings Prominence

**Challenge**: MVP treats labor law violations as warnings, but they must be visually prominent.

**Solution**: Dedicated warnings section with icon, bold text, and distinct styling.

**UI**:
```tsx
{violations && violations.length > 0 && (
  <div className={styles.warnings}>
    <div className={styles.warningHeader}>
      <AlertTriangle size={24} className={styles.warningIcon} />
      <h4>Avvisi di Conformità</h4>
    </div>
    <p className={styles.warningSubtext}>
      Le seguenti criticità richiedono revisione manageriale prima della pubblicazione.
    </p>
    <ul className={styles.violationList}>
      {violations.map((violation, index) => (
        <li key={index} className={styles.violationItem}>
          {violation}
        </li>
      ))}
    </ul>
  </div>
)}
```

**CSS**:
```css
.warnings {
  background: #fef3c7; /* Light amber */
  border: 2px solid var(--color-warning);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  margin: var(--spacing-lg) 0;
}

.warningHeader {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-warning);
  font-weight: 700;
}

.violationList {
  margin-top: var(--spacing-md);
  list-style: none;
}

.violationItem {
  padding: var(--spacing-sm);
  background: white;
  margin-bottom: var(--spacing-sm);
  border-radius: var(--radius-sm);
  border-left: 4px solid var(--color-warning);
}
```

---

### 6. Job History Schedule Republishing

**Challenge**: Allow managers to republish past generated schedules without regenerating.

**Solution**:
1. Store full `ScheduleResponse` in job result
2. Add "Pubblica Turni" button in job history
3. Transform stored schedule to `PublishScheduleRequest`
4. Call publish API

**Code**:
```typescript
// In JobHistory component
const handleViewSchedule = (job: JobStatusResponse) => {
  if (job.result) {
    setSelectedSchedule(job.result);
    setSelectedJob(job); // Store full job for metadata
  }
};

const handlePublish = (sendWhatsApp: boolean = false) => {
  if (!selectedSchedule || !selectedJob?.request) return;

  const shiftsToPublish: ShiftToPublish[] = selectedSchedule.shifts.map((shift) => ({
    staffId: shift.staffId,
    phaseId: shift.phaseId,
    startTime: shift.startTime,
    endTime: shift.endTime,
  }));

  const publishRequest: PublishScheduleRequest = {
    venueId: selectedJob.request.venueId,
    startDate: selectedJob.request.dateRange.startDate,
    endDate: selectedJob.request.dateRange.endDate,
    shifts: shiftsToPublish,
    aiReasoning: selectedSchedule.metadata.aiReasoning,
    aiMode: selectedSchedule.metadata.mode,
    sendWhatsApp,
  };

  publishSchedule(publishRequest);
};

// Render ScheduleResults with publish handler
{selectedSchedule && (
  <ScheduleResults
    schedule={selectedSchedule}
    onBack={() => { setSelectedSchedule(null); setSelectedJob(null); }}
    onPublish={handlePublish}
    isPublishing={isPublishing}
    whatsAppEnabled={whatsAppEnabled}
  />
)}
```

---

### 7. Route Consistency Fix

**Problem**: After folder restructure, many routes hardcoded without `/dashboard/smart-shifts/` prefix.

**Solution**: Global search and replace of 11 routes across 9 files.

**Updated Routes**:
```typescript
// Before
router.push('/dashboard/venues');
router.push('/dashboard/schedules/list');

// After
router.push('/dashboard/smart-shifts/venues');
router.push('/dashboard/smart-shifts/schedules/list');
```

**Files Fixed**:
- `useScheduleGenerator.ts` (redirect after publish)
- `useSchedulesList.ts` (navigate to detail)
- `useVenueDetailPage.ts` (navigate to staff)
- `page.tsx` (schedules, exports, requests, staff, absences empty states)
- `VenueCard.tsx` (view details link)
- `useStaffTable.ts` (view schedule link)
- `usePhasesManagement.ts` (navigate to venues)

---

## Performance Optimizations

### 1. React Query Caching
- Stale time: 1 minute (reduces refetches)
- Cache persists across navigations
- Invalidation on mutations

### 2. Code Splitting
- Next.js automatic route-based splitting
- Dynamic imports for heavy components:
  ```tsx
  const JobHistory = dynamic(() => import('./components/JobHistory'), {
    loading: () => <LoadingSpinner />,
  });
  ```

### 3. Image Optimization
- Use Next.js `<Image>` component
- Lazy loading by default
- Automatic WebP conversion

### 4. CSS Modules
- Scoped styles (no global conflicts)
- Automatic unused CSS removal in production
- Minimal runtime overhead

---

## Testing Strategy (Prepared for v2)

### Unit Tests (Jest + React Testing Library)
```bash
npm run test
```

**Example**:
```typescript
// src/features/smart-shifts/staff/hooks/useStaffForm.test.ts
import { renderHook, act } from '@testing-library/react';
import { useStaffForm } from './useStaffForm';

describe('useStaffForm', () => {
  it('validates end date is after hire date', () => {
    const { result } = renderHook(() => useStaffForm());
    
    act(() => {
      result.current.handleChange('hireDate', '2025-01-01');
      result.current.handleChange('endDate', '2024-12-31'); // Before hire date
    });
    
    expect(result.current.errors.endDate).toBe('End date must be after hire date');
  });
});
```

### E2E Tests (Playwright)
```bash
npm run test:e2e
```

**Example**:
```typescript
// e2e/ai-scheduler.spec.ts
import { test, expect } from '@playwright/test';

test('generate and publish schedule', async ({ page }) => {
  await page.goto('/dashboard/smart-shifts/ai-scheduler');
  
  // Step 1
  await page.fill('[name="startDate"]', '2025-11-14');
  await page.fill('[name="endDate"]', '2025-11-20');
  await page.click('button:has-text("Avanti")');
  
  // Step 2
  await expect(page.locator('text=Staff Disponibili')).toBeVisible();
  await page.click('button:has-text("Genera Turni")');
  
  // Step 3
  await expect(page.locator('text=Turni Generati')).toBeVisible();
  await page.click('button:has-text("Pubblica")');
  
  await expect(page).toHaveURL(/\/schedules\/.*\/.*$/);
});
```

---

## Deployment

### Production Build

```bash
# Build optimized production bundle
npm run build

# Test production build locally
npm start
```

### Environment Variables (Production)

```bash
# Vercel/Netlify
NEXT_PUBLIC_API_URL=https://api.ristowai.com
```

### Recommended Hosting

1. **Vercel** (recommended for Next.js)
   - Automatic deployments from Git
   - Edge functions for SSR
   - Image optimization CDN

2. **Netlify**
   - Similar to Vercel
   - Good for static exports

3. **Custom VPS** (Nginx + PM2)
   ```bash
   npm run build
   pm2 start npm --name "ristowai-frontend" -- start
   ```

---

## Troubleshooting

### Common Issues

#### 1. "Cannot read property 'whatsapp' of undefined"

**Cause**: Venue settings not loaded yet.

**Fix**: Use optional chaining:
```typescript
const whatsAppEnabled = venue?.settings?.whatsapp?.enabled || false;
```

---

#### 2. Redirect loop on login

**Cause**: Auth token not persisting.

**Fix**: Check `localStorage` in browser DevTools. Ensure `authStore` is saving token:
```typescript
// In authStore.ts
login: async (email, password) => {
  const { token, user } = await authApi.login(email, password);
  localStorage.setItem('token', token);
  set({ token, user, isAuthenticated: true });
},
```

---

#### 3. API calls returning 401

**Cause**: JWT expired or missing.

**Fix**: Implement token refresh:
```typescript
// In apiClient.ts interceptor
if (error.response?.status === 401) {
  const refreshed = await authStore.getState().refreshToken();
  if (refreshed) {
    // Retry original request
    return apiClient.request(error.config);
  } else {
    // Logout
    authStore.getState().logout();
    window.location.href = '/login';
  }
}
```

---

#### 4. Schedules not showing after publish

**Cause**: React Query cache not invalidated.

**Fix**: Invalidate schedules query after publish:
```typescript
const { publishSchedule } = usePublishSchedule({
  onSuccess: (data) => {
    queryClient.invalidateQueries(['schedules', venueId]);
    router.push(`/dashboard/smart-shifts/schedules/${venueId}/${data.scheduleId}`);
  },
});
```

---

## Contributing

### Code Style
- Use TypeScript for all new files
- Follow Airbnb React style guide
- Use functional components + hooks (no class components)
- Prefer CSS Modules over styled-components

### Git Workflow
- Branch naming: `feature/contract-alerts-ui`, `fix/whatsapp-toggle`
- Commit messages: Conventional Commits (`feat:`, `fix:`, `style:`)

### Component Checklist
- [ ] TypeScript types defined
- [ ] Props documented (JSDoc or TypeScript)
- [ ] Accessible (ARIA labels, keyboard nav)
- [ ] Responsive (test mobile + desktop)
- [ ] Error states handled
- [ ] Loading states included

---

## Changelog

### v1.0.0 (MVP - Nov 2025)
- ✅ AI scheduler wizard (3 steps)
- ✅ Staff management with contract alerts
- ✅ Venue configuration with WhatsApp settings
- ✅ Work phases setup with presets
- ✅ Labor law warnings display (prominent)
- ✅ Job history with republish capability
- ✅ Contract alert badge + panel
- ✅ Responsive design (mobile-ready)
- ✅ Consistent routing (`/dashboard/smart-shifts/` prefix)

### Planned v2.0
- Advanced analytics dashboard
- Real-time notifications (WebSockets)
- Time bank visualization
- Payroll export UI
- Staff mobile app integration
- Dark mode
- Multi-language support (Italian + English)

---

**End of Frontend Documentation**

For backend API details, see `backend/README.md`.
