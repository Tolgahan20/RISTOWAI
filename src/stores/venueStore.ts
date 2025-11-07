import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface VenueStoreState {
  selectedVenueId: string | null;
  setSelectedVenueId: (venueId: string | null) => void;
  clearSelectedVenueId: () => void;
}

export const useVenueStore = create<VenueStoreState>()(
  persist(
    (set) => ({
      selectedVenueId: null,
      setSelectedVenueId: (venueId) => set({ selectedVenueId: venueId }),
      clearSelectedVenueId: () => set({ selectedVenueId: null }),
    }),
    {
      name: 'venue-storage', // localStorage key
    }
  )
);

