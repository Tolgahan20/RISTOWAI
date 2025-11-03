import { useState } from 'react';
import { tokenService } from '../services/token.service';

/**
 * Hook to get the restaurantId from the access token
 * Returns null if no token or restaurantId is not present in the token
 */
export const useRestaurantId = (): string | null => {
  const [restaurantId] = useState<string | null>(() => {
    // Initialize state from token on mount
    const token = tokenService.getAccessToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.restaurantId || null;
      } catch (error) {
        console.error('[useRestaurantId] Error parsing token:', error);
        return null;
      }
    }
    return null;
  });

  return restaurantId;
};

