export enum VenueType {
  RESTAURANT = 'RESTAURANT',
  CAFE = 'CAFE',
  BAR = 'BAR',
  CLUB = 'CLUB',
  FAST_FOOD = 'FAST_FOOD',
  FOOD_TRUCK = 'FOOD_TRUCK',
  BAKERY = 'BAKERY',
  PIZZERIA = 'PIZZERIA',
  OTHER = 'OTHER',
}

export interface OpeningHoursDay {
  open: string;
  close: string;
}

export interface OpeningHours {
  monday?: OpeningHoursDay;
  tuesday?: OpeningHoursDay;
  wednesday?: OpeningHoursDay;
  thursday?: OpeningHoursDay;
  friday?: OpeningHoursDay;
  saturday?: OpeningHoursDay;
  sunday?: OpeningHoursDay;
}

export interface VenueSettings {
  minRestHours?: number;
  maxDailyHours?: number;
  enablePunchClock?: boolean;
  breakDuration?: number;
  minShiftDuration?: number;
  maxShiftDuration?: number;
  minAdvanceBooking?: number;
}

export interface Venue {
  id: string;
  restaurantId: string;
  name: string;
  address?: string;
  timezone: string;
  type: VenueType;
  capacity?: number;
  contactEmail?: string;
  contactPhone?: string;
  openingHours?: OpeningHours;
  settings?: VenueSettings;
  staff?: any[]; // Staff members when fetched with relations
  createdAt: string;
  updatedAt: string;
}

export interface CreateVenueRequest {
  name: string;
  address?: string;
  timezone: string;
  type: VenueType;
  openingHours?: OpeningHours;
  settings?: VenueSettings;
}

export interface UpdateVenueRequest {
  name?: string;
  address?: string;
  timezone?: string;
  type?: VenueType;
  openingHours?: OpeningHours;
  settings?: VenueSettings;
}

export const VENUE_TYPE_LABELS: Record<VenueType, string> = {
  [VenueType.RESTAURANT]: 'Restaurant',
  [VenueType.CAFE]: 'Cafe',
  [VenueType.BAR]: 'Bar',
  [VenueType.CLUB]: 'Club',
  [VenueType.FAST_FOOD]: 'Fast Food',
  [VenueType.FOOD_TRUCK]: 'Food Truck',
  [VenueType.BAKERY]: 'Bakery',
  [VenueType.PIZZERIA]: 'Pizzeria',
  [VenueType.OTHER]: 'Other',
};

export const DAYS_OF_WEEK = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

