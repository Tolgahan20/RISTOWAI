'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'react-feather';
import { VenueSelector, type Venue } from '../../ui/VenueSelector';
import styles from './page-header.module.css';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  backButtonUrl?: string;
  showVenueSelector?: boolean;
  venues?: Venue[];
  selectedVenueId?: string | null;
  onVenueChange?: (venueId: string) => void;
  actions?: React.ReactNode;
}

export function PageHeader({
  title,
  subtitle,
  showBackButton = false,
  backButtonUrl,
  showVenueSelector = false,
  venues = [],
  selectedVenueId,
  onVenueChange,
  actions,
}: PageHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (backButtonUrl) {
      window.location.href = backButtonUrl;
    } else {
      router.back();
    }
  };

  return (
    <div className={styles.container}>
      {/* Title Section with optional Venue Selector on the right */}
      <div className={styles.titleSection}>
        <div className={styles.titleContent}>
          {showBackButton && (
            <button onClick={handleBack} className={styles.backButton} aria-label="Go back">
              <ArrowLeft size={20} />
            </button>
          )}
          <div>
            <h1 className={styles.title}>{title}</h1>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
        </div>

        {/* Venue Selector on the right */}
        {showVenueSelector && venues.length > 0 && onVenueChange && (
          <div className={styles.venueWrapper}>
            <VenueSelector
              venues={venues}
              selectedVenueId={selectedVenueId || null}
              onVenueChange={onVenueChange}
            />
          </div>
        )}
      </div>

      {/* Custom Actions Section (below title if provided) */}
      {actions && (
        <div className={styles.actionsSection}>
          <div className={styles.customActions}>{actions}</div>
        </div>
      )}
    </div>
  );
}

