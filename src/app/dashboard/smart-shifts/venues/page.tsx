'use client';

import { useState } from 'react';
import { Plus } from 'react-feather';
import { PageHeader } from '@/components/dashboard/layout';
import { Button } from '@/components/dashboard/ui';
import { VenueList } from '@/features/smart-shifts/venues/components';
import { VenueModal } from '@/features/smart-shifts/venues/components/VenueModal';
import { useVenues } from '@/features/smart-shifts/venues/hooks';
import type { Venue } from '@/features/smart-shifts/venues/types';
import pageLayout from '@/styles/page-layout.module.css';

export default function VenuesPage() {
  const { data: venues } = useVenues();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | undefined>(undefined);

  const handleCreateNew = () => {
    setSelectedVenue(undefined);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedVenue(undefined);
  };

  const venueCount = venues?.length || 0;
  const subtitle = venueCount > 0 
    ? `${venueCount} ${venueCount === 1 ? 'locale' : 'locali'}`
    : 'Configura e gestisci i tuoi locali';

  return (
    <div className={pageLayout.pageContainer}>
      <PageHeader
        title="Gestione Locali"
        subtitle={subtitle}
        actions={
          <Button onClick={handleCreateNew} variant="primary">
            <Plus size={18} />
            Crea Nuovo Locale
          </Button>
        }
      />
      <VenueList 
        onEdit={setSelectedVenue}
        onOpenModal={() => setIsModalOpen(true)}
      />
      <VenueModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        venue={selectedVenue} 
      />
    </div>
  );
}

