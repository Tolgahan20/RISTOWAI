import React, { useState } from 'react';
import { LoadingState } from '@/components/dashboard/ui/LoadingState';
import { ErrorState } from '@/components/dashboard/ui/ErrorState';
import { EmptyState } from '@/components/dashboard/ui/EmptyState';
import { ConfirmModal } from '@/components/dashboard/ui/ConfirmModal';
import { useVenues, useVenueDelete } from '../../hooks';
import { VenueCard } from '../VenueCard';
import { VENUE_MESSAGES } from '../../../common/constants/messages';
import type { Venue } from '../../types';
import styles from './venue-list.module.css';

interface VenueListProps {
  onEdit: (venue: Venue | undefined) => void;
  onOpenModal: () => void;
}

export const VenueList: React.FC<VenueListProps> = ({ onEdit, onOpenModal }) => {
  const { data: venues, isLoading, isError, refetch } = useVenues();
  const { handleDelete: deleteVenue, isDeleting } = useVenueDelete();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [venueToDelete, setVenueToDelete] = useState<string | null>(null);

  const handleEdit = (venue: Venue) => {
    onEdit(venue);
    onOpenModal();
  };

  const handleDeleteClick = (venueId: string) => {
    setVenueToDelete(venueId);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (venueToDelete) {
      deleteVenue(venueToDelete);
      setIsDeleteModalOpen(false);
      setVenueToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setVenueToDelete(null);
  };

  if (isLoading) {
    return <LoadingState message="Caricamento locali..." />;
  }

  if (isError) {
    return (
      <ErrorState
        message="Errore nel caricamento dei locali"
        onRetry={refetch}
        retryLabel="Riprova"
      />
    );
  }

  if (!venues || venues.length === 0) {
    return (
      <EmptyState
        title="Nessun locale trovato"
        description="Inizia creando il tuo primo locale per gestire i turni del personale."
        action={{
          label: '+ Crea Nuovo Locale',
          onClick: onOpenModal,
        }}
      />
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {venues.map((venue) => (
          <VenueCard
            key={venue.id}
            venue={venue}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />
        ))}
      </div>
      
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        title="Elimina Locale"
        message={VENUE_MESSAGES.delete.confirm}
        confirmText="Elimina"
        cancelText="Annulla"
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  );
};

