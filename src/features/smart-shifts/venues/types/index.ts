export interface Venue {
  id: string;
  restaurantId: string;
  name: string;
  address?: string;
  timezone: string;
  type: string;
  openingHoursJson?: any;
  settingsJson?: any;
  createdAt: string;
  updatedAt: string;
}

export interface CreateVenueRequest {
  restaurantId: string;
  name: string;
  address?: string;
  timezone: string;
  type: string;
  openingHoursJson?: any;
  settingsJson?: any;
}

export interface UpdateVenueRequest {
  name?: string;
  address?: string;
  timezone?: string;
  type?: string;
  openingHoursJson?: any;
  settingsJson?: any;
}

