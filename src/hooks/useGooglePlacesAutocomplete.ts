/// <reference types="@types/google.maps" />
import { useEffect, useRef } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';

interface UseGooglePlacesAutocompleteProps {
  onPlaceSelected: (place: any) => void;
  options?: any;
  apiKey?: string; // Kept for backward compatibility but not used
}

export const useGooglePlacesAutocomplete = ({
  onPlaceSelected,
  options = {}
}: UseGooglePlacesAutocompleteProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const placesLibrary = useMapsLibrary('places');

  useEffect(() => {
    if (!placesLibrary || !inputRef.current) return;

    // Create autocomplete instance
    autocompleteRef.current = new placesLibrary.Autocomplete(
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

    return () => {
      // Cleanup
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [placesLibrary, options, onPlaceSelected]);

  return inputRef;
};

