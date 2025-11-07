'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './address-autocomplete.module.css';

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string, placeDetails?: google.maps.places.PlaceResult) => void;
  onBlur?: () => void;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  name?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  onBlur,
  placeholder = 'Indirizzo',
  error,
  touched,
  name,
}: AddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load Google Maps script
    if (typeof window === 'undefined') return;

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.error('Google Maps API key is not set');
      return;
    }

    // Check if script is already loaded
    if (window.google?.maps?.places) {
      setTimeout(() => {
        setIsLoaded(true);
      }, 0);
      return;
    }

    // Load script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setIsLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

    // Initialize autocomplete
    autocompleteRef.current = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'it' }, // Restrict to Italy
      fields: ['formatted_address', 'address_components', 'geometry', 'name'],
    });

    // Listen for place selection
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (place?.formatted_address) {
        onChange(place.formatted_address, place);
      }
    });
  }, [isLoaded, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={styles.wrapper}>
      <input
        ref={inputRef}
        type="text"
        name={name}
        value={value}
        onChange={handleInputChange}
        onBlur={onBlur}
        placeholder={placeholder}
        className={`${styles.input} ${error && touched ? styles.error : ''}`}
        autoComplete="off"
      />
      {error && touched && <span className={styles.errorText}>{error}</span>}
    </div>
  );
}

