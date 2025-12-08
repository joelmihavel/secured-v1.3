/// <reference types="@types/google.maps" />
import { useEffect, useRef } from 'react';
import { loadGoogleMapsAPI } from '@/lib/googleMapsLoader';

interface UseGooglePlacesAutocompleteProps {
  onPlaceSelected: (place: any) => void;
  apiKey: string;
  options?: any;
}

export const useGooglePlacesAutocomplete = ({
  onPlaceSelected,
  apiKey,
  options = {}
}: UseGooglePlacesAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    // Use the centralized loader to prevent duplicate script loading
    loadGoogleMapsAPI(apiKey, ['places'])
      .then(() => {
        initAutocomplete();
      })
      .catch((error) => {
        console.error('Failed to load Google Maps API:', error);
      });

    return () => {
      // Cleanup
      if (autocompleteRef.current && (window as any).google?.maps?.event) {
        (window as any).google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [apiKey]);

  const initAutocomplete = () => {
    if (!inputRef.current || typeof window === 'undefined') return;

    const google = (window as any).google;
    if (!google?.maps?.places) return;

    // Create autocomplete instance
    autocompleteRef.current = new google.maps.places.Autocomplete(
      inputRef.current,
      {
        types: ['establishment', 'geocode'],
        componentRestrictions: { country: 'in' }, // Restrict to India
        ...options
      }
    );

    // Add listener for place selection
    autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (place) {
        onPlaceSelected(place);
      }
    });
  };

  return inputRef;
};

