import { axiosInstance } from '../../common/api/axios';
import { api } from '../../common/constants/api';
import type { Venue, CreateVenueRequest, UpdateVenueRequest } from '../types';

/**
 * Get all venues for a restaurant
 */
export const getVenues = async (restaurantId: string): Promise<Venue[]> => {
  const response = await axiosInstance.get(api.venues.list(restaurantId));
  return response.data;
};

/**
 * Get a specific venue by ID
 */
export const getVenueById = async (restaurantId: string, venueId: string): Promise<Venue> => {
  const response = await axiosInstance.get(api.venues.byId(restaurantId, venueId));
  return response.data;
};

/**
 * Create a new venue
 */
export const createVenue = async (restaurantId: string, data: CreateVenueRequest): Promise<Venue> => {
  const response = await axiosInstance.post(api.venues.create(restaurantId), data);
  return response.data;
};

/**
 * Update a venue
 */
export const updateVenue = async (
  restaurantId: string,
  venueId: string,
  data: UpdateVenueRequest
): Promise<Venue> => {
  const response = await axiosInstance.patch(api.venues.byId(restaurantId, venueId), data);
  return response.data;
};

/**
 * Delete a venue
 */
export const deleteVenue = async (restaurantId: string, venueId: string): Promise<void> => {
  await axiosInstance.delete(api.venues.byId(restaurantId, venueId));
};

/**
 * Get venue with staff members
 */
export const getVenueWithStaff = async (restaurantId: string, venueId: string): Promise<Venue> => {
  const response = await axiosInstance.get(api.venues.withStaff(restaurantId, venueId));
  return response.data;
};

/**
 * Get venue with all members
 */
export const getVenueWithMembers = async (restaurantId: string, venueId: string): Promise<Venue> => {
  const response = await axiosInstance.get(api.venues.withMembers(restaurantId, venueId));
  return response.data;
};

export const venuesApi = {
  getVenues,
  getVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
  getVenueWithStaff,
  getVenueWithMembers,
};

