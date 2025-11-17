import React from 'react';
import { useRouter } from 'next/navigation';
import { Home, MapPin, Clock, Calendar, Edit2, Trash2, Eye } from 'react-feather';
import { Button } from '@/components/dashboard/ui/Button';
import { VENUE_TYPE_LABELS } from '../../types';
import type { Venue } from '../../types';
import styles from './venue-card.module.css';

interface VenueCardProps {
  venue: Venue;
  onEdit: (venue: Venue) => void;
  onDelete: (venueId: string) => void;
}

export const VenueCard: React.FC<VenueCardProps> = ({ venue, onEdit, onDelete }) => {
  const router = useRouter();
  const formatOpeningHours = () => {
    if (!venue.openingHours || Object.keys(venue.openingHours).length === 0) {
      return 'Orari non impostati';
    }

    const days = Object.entries(venue.openingHours);
    if (days.length === 0) return 'Orari non impostati';

    const [, firstHours] = days[0];
    return `${firstHours.open} - ${firstHours.close}`;
  };

  const getOpenDaysCount = () => {
    if (!venue.openingHours) return 0;
    return Object.keys(venue.openingHours).length;
  };

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.iconWrapper}>
          <Home size={24} />
        </div>
        <div className={styles.info}>
          <h3 className={styles.name}>{venue.name}</h3>
          <span className={styles.type}>{VENUE_TYPE_LABELS[venue.type]}</span>
        </div>
      </div>

      <div className={styles.details}>
        {venue.address && (
          <div className={styles.detail}>
            <MapPin size={16} />
            <span className={styles.detailText}>{venue.address}</span>
          </div>
        )}

        <div className={styles.detail}>
          <Clock size={16} />
          <span className={styles.detailText}>{formatOpeningHours()}</span>
        </div>

        <div className={styles.detail}>
          <Calendar size={16} />
          <span className={styles.detailText}>
            Aperto {getOpenDaysCount()} {getOpenDaysCount() === 1 ? 'giorno' : 'giorni'}/settimana
          </span>
        </div>
      </div>

      {venue.settings && (Object.keys(venue.settings).length > 0) && (
        <div className={styles.settings}>
          {venue.settings.minRestHours && (
            <div className={styles.settingItem}>
              <span className={styles.settingLabel}>Riposo minimo</span>
              <span className={styles.settingValue}>{venue.settings.minRestHours}h</span>
            </div>
          )}
          {venue.settings.maxDailyHours && (
            <div className={styles.settingItem}>
              <span className={styles.settingLabel}>Max giornaliero</span>
              <span className={styles.settingValue}>{venue.settings.maxDailyHours}h</span>
            </div>
          )}
          {venue.settings.breakDuration && (
            <div className={styles.settingItem}>
              <span className={styles.settingLabel}>Pausa</span>
              <span className={styles.settingValue}>{venue.settings.breakDuration}m</span>
            </div>
          )}
        </div>
      )}

      <div className={styles.actions}>
        <Button variant="ghost" onClick={() => router.push(`/dashboard/smart-shifts/venues/${venue.id}`)} className={styles.viewButton}>
          <Eye size={16} />
          Dettagli
        </Button>
        <Button variant="secondary" onClick={() => onEdit(venue)} className={styles.editButton}>
          <Edit2 size={16} />
          Modifica
        </Button>
        <Button variant="secondary" onClick={() => onDelete(venue.id)} className={styles.deleteButton}>
          <Trash2 size={16} />
          Elimina
        </Button>
      </div>
    </div>
  );
};

