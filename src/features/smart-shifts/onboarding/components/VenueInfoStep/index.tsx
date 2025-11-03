'use client';

import { Input, Select, Button, AddressAutocomplete } from '@/components/dashboard/ui';
import { useVenueInfoStep } from '../../hooks/useVenueInfoStep';
import type { VenueInfoData } from '../../types';
import styles from './venue-info-step.module.css';

interface VenueInfoStepProps {
  onSave: (data: VenueInfoData) => Promise<void>;
  isSaving: boolean;
  initialData?: VenueInfoData | null;
}

export function VenueInfoStep({ onSave, isSaving, initialData }: VenueInfoStepProps) {
  const { formData, errors, touched, handleChange, handleBlur, handleSubmit, setFormData } = 
    useVenueInfoStep({ onSave, initialData });

  const handleAddressChange = (address: string) => {
    setFormData((prev: VenueInfoData) => ({
      ...prev,
      address,
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Informazioni del Locale</h1>
        <p className={styles.description}>
          Iniziamo con le informazioni di base del tuo locale
        </p>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Nome del locale"
            error={errors.name}
            touched={touched.name}
          />

          <AddressAutocomplete
            name="address"
            value={formData.address || ''}
            onChange={handleAddressChange}
            placeholder="Indirizzo"
            error={errors.address}
            touched={touched.address}
          />

          <Input
            type="text"
            name="taxId"
            value={formData.taxId || ''}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Partita IVA / Codice Fiscale"
          />

          <div className={styles.row}>
            <Select
              name="timezone"
              value={formData.timezone}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.timezone}
              touched={touched.timezone}
            >
              <option value="">Fuso orario</option>
              <option value="Europe/Rome">Europe/Rome</option>
              <option value="Europe/London">Europe/London</option>
              <option value="Europe/Paris">Europe/Paris</option>
            </Select>

            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              onBlur={handleBlur}
              error={errors.type}
              touched={touched.type}
            >
              <option value="">Tipo</option>
              <option value="RESTAURANT">Ristorante</option>
              <option value="CAFE">Caffetteria</option>
              <option value="BAR">Bar</option>
              <option value="PIZZERIA">Pizzeria</option>
            </Select>
          </div>

          <Button type="submit" disabled={isSaving} size="large" fullWidth>
            {isSaving ? 'Salvataggio...' : 'Continua'}
          </Button>
        </form>
      </div>
    </div>
  );
}
