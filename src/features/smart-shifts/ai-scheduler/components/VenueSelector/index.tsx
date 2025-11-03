'use client';

import { MapPin } from 'react-feather';
import { Select, LoadingState, EmptyState } from '@/components/dashboard/ui';
import type { Venue } from '../../../venues/types';
import styles from './venue-selector.module.css';

interface VenueSelectorProps {
  venues: Venue[];
  selectedVenueId: string;
  onSelectVenue: (venueId: string) => void;
  isLoading: boolean;
}

export function VenueSelector({
  venues,
  selectedVenueId,
  onSelectVenue,
  isLoading,
}: VenueSelectorProps) {
  if (isLoading) {
    return <LoadingState message="Caricamento locali..." />;
  }

  if (!venues || venues.length === 0) {
    return (
      <EmptyState
        icon={<MapPin size={48} />}
        title="Nessun locale disponibile"
        description="Completa prima l'onboarding per creare il tuo primo locale."
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Seleziona Locale</h2>
        <p className={styles.description}>
          Scegli il locale per cui vuoi generare i turni
        </p>

        <div className={styles.selectWrapper}>
          <Select
            value={selectedVenueId}
            onChange={(e) => onSelectVenue(e.target.value)}
          >
            <option value="" disabled>
              Seleziona un locale
            </option>
            {venues.map((venue) => (
              <option key={venue.id} value={venue.id}>
                {venue.name}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}

