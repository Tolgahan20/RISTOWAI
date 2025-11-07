'use client';

import React from 'react';
import { MapPin } from 'react-feather';
import styles from './venue-selector.module.css';

export interface Venue {
  id: string;
  name: string;
}

export interface VenueSelectorProps {
  venues: Venue[];
  selectedVenueId: string | null;
  onVenueChange: (venueId: string) => void;
  label?: string;
}

export function VenueSelector({
  venues,
  selectedVenueId,
  onVenueChange,
  label = 'Locale:',
}: VenueSelectorProps) {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <MapPin size={16} />
      </div>
      <label className={styles.label}>{label}</label>
      <select
        value={selectedVenueId || ''}
        onChange={(e) => onVenueChange(e.target.value)}
        className={styles.select}
      >
        <option value="" disabled>
          Seleziona un locale
        </option>
        {venues.map((venue) => (
          <option key={venue.id} value={venue.id}>
            {venue.name}
          </option>
        ))}
      </select>
    </div>
  );
}

