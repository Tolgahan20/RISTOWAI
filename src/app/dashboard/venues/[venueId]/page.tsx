'use client';

import { useParams } from 'next/navigation';
import { MapPin, Clock, Users, Calendar, Edit2, ArrowLeft, Briefcase, Mail, Phone } from 'react-feather';
import { Button } from '@/components/dashboard/ui/Button';
import { LoadingState, ErrorState } from '@/components/dashboard/ui';
import { VenueModal } from '@/features/smart-shifts/venues/components';
import { VENUE_TYPE_LABELS } from '@/features/smart-shifts/venues/types';
import { formatOpeningHoursForDisplay, getStaffDisplayName, formatDate } from '@/features/smart-shifts/venues/utils';
import { useVenueDetailPage } from './hooks/useVenueDetailPage';
import styles from './venue-detail.module.css';

export default function VenueDetailPage() {
  const params = useParams();
  const venueId = params.venueId as string;

  const {
    venue,
    isLoading,
    isError,
    refetch,
    isEditModalOpen,
    handleOpenEdit,
    handleCloseEdit,
    handleBack,
    handleNavigateToStaff,
  } = useVenueDetailPage(venueId);

  if (isLoading) {
    return <LoadingState message="Caricamento dettagli locale..." />;
  }

  if (isError || !venue) {
    return (
      <ErrorState
        message="Errore nel caricamento dei dettagli del locale"
        onRetry={refetch}
        retryLabel="Riprova"
      />
    );
  }

  const formattedOpeningHours = formatOpeningHoursForDisplay(venue.openingHours);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Button variant="ghost" onClick={handleBack} className={styles.backButton}>
          <ArrowLeft size={20} />
        </Button>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.title}>{venue.name}</h1>
            <p className={styles.subtitle}>
              {VENUE_TYPE_LABELS[venue.type]} • {venue.address}
            </p>
          </div>
          <Button variant="primary" onClick={handleOpenEdit}>
            <Edit2 size={16} />
            Modifica
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        {/* Basic Info Card */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>Informazioni Generali</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoItem}>
              <div className={styles.infoIcon}>
                <MapPin size={20} />
              </div>
              <div className={styles.infoContent}>
                <div className={styles.infoLabel}>Indirizzo</div>
                <div className={styles.infoValue}>{venue.address}</div>
              </div>
            </div>

            {venue.capacity && (
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <Users size={20} />
                </div>
                <div className={styles.infoContent}>
                  <div className={styles.infoLabel}>Capacità</div>
                  <div className={styles.infoValue}>{venue.capacity} posti</div>
                </div>
              </div>
            )}

            {venue.contactEmail && (
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <Mail size={20} />
                </div>
                <div className={styles.infoContent}>
                  <div className={styles.infoLabel}>Email</div>
                  <div className={styles.infoValue}>{venue.contactEmail}</div>
                </div>
              </div>
            )}

            {venue.contactPhone && (
              <div className={styles.infoItem}>
                <div className={styles.infoIcon}>
                  <Phone size={20} />
                </div>
                <div className={styles.infoContent}>
                  <div className={styles.infoLabel}>Telefono</div>
                  <div className={styles.infoValue}>{venue.contactPhone}</div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Opening Hours Card */}
        {venue.openingHours && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>
              <Clock size={20} />
              Orari di Apertura
            </h2>
            <div className={styles.hoursGrid}>
              {formattedOpeningHours.map((day) => (
                <div key={day.day} className={styles.dayRow}>
                  <span className={styles.dayLabel}>{day.label}</span>
                  <span className={styles.dayHours}>{day.hours}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Staff Card */}
        {venue.staff && venue.staff.length > 0 && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>
                <Users size={20} />
                Staff ({venue.staff.length})
              </h2>
              <Button variant="secondary" onClick={handleNavigateToStaff}>
                Gestisci Staff
              </Button>
            </div>
            <div className={styles.staffGrid}>
              {venue.staff.map((member: any) => (
                <div key={member.id} className={styles.staffCard}>
                  <div className={styles.staffHeader}>
                    <div className={styles.staffAvatar}>
                      <Briefcase size={20} />
                    </div>
                    <div className={styles.staffInfo}>
                      <div className={styles.staffName}>
                        {getStaffDisplayName(member)}
                      </div>
                      <div className={styles.staffRole}>{member.staffRole}</div>
                    </div>
                  </div>
                  <div className={styles.staffDetails}>
                    <div className={styles.staffDetail}>
                      <span className={styles.detailLabel}>Contratto:</span>
                      <span className={styles.detailValue}>{member.contractType}</span>
                    </div>
                    <div className={styles.staffDetail}>
                      <span className={styles.detailLabel}>Ore Settimanali:</span>
                      <span className={styles.detailValue}>{member.weeklyHours}h</span>
                    </div>
                    {member.hireDate && (
                      <div className={styles.staffDetail}>
                        <Calendar size={14} />
                        <span className={styles.detailValue}>
                          Dal {formatDate(member.hireDate)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Card */}
        {venue.settings && (
          <div className={styles.card}>
            <h2 className={styles.cardTitle}>Impostazioni</h2>
            <div className={styles.settingsGrid}>
              <div className={styles.settingItem}>
                <span className={styles.settingLabel}>Durata Turno Minima</span>
                <span className={styles.settingValue}>
                  {venue.settings.minShiftDuration || 4} ore
                </span>
              </div>
              <div className={styles.settingItem}>
                <span className={styles.settingLabel}>Durata Turno Massima</span>
                <span className={styles.settingValue}>
                  {venue.settings.maxShiftDuration || 8} ore
                </span>
              </div>
              <div className={styles.settingItem}>
                <span className={styles.settingLabel}>Durata Pausa</span>
                <span className={styles.settingValue}>
                  {venue.settings.breakDuration || 30} minuti
                </span>
              </div>
              <div className={styles.settingItem}>
                <span className={styles.settingLabel}>Preavviso Minimo</span>
                <span className={styles.settingValue}>
                  {venue.settings.minAdvanceBooking || 24} ore
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <VenueModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEdit}
        venue={venue}
      />
    </div>
  );
}

