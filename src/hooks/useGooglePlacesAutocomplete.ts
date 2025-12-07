/// <reference types="@types/google.maps" />
import { useEffect, useRef } from 'react';

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
    // Check if Google Maps API is already loaded
    if (typeof window !== 'undefined' && (window as any).google?.maps?.places) {
      initAutocomplete();
      return;
    }

    // Load Google Maps API
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initAutocomplete();
    };
    document.head.appendChild(script);

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
