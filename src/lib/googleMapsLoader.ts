/// <reference types="@types/google.maps" />

let isLoading = false;
let isLoaded = false;
const callbacks: (() => void)[] = [];

/**
 * Ensures the Google Maps JavaScript API is loaded only once.
 * Multiple calls to this function will not create duplicate script tags.
 * Compatible with both the legacy API and the new importLibrary method.
 * 
 * @param apiKey - Google Maps API key
 * @param libraries - Array of libraries to load (e.g., ['places'])
 * @returns Promise that resolves when the API is loaded
 */
export const loadGoogleMapsAPI = (
  apiKey: string,
  libraries: string[] = ['places']
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Window is not defined'));
      return;
    }

    // Check if already loaded (either legacy or new API)
    const isApiLoaded = (window as any).google?.maps || (window as any).google?.maps?.importLibrary;
    
    if (isApiLoaded) {
      isLoaded = true;
      resolve();
      return;
    }

    // If currently loading, add to callback queue
    if (isLoading) {
      callbacks.push(resolve);
      return;
    }

    // Check if script tag already exists (from APIProvider or previous load)
    const existingScript = document.querySelector(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );

    if (existingScript) {
      // Script exists but might not be loaded yet
      isLoading = true;
      const checkLoaded = setInterval(() => {
        if ((window as any).google?.maps || (window as any).google?.maps?.importLibrary) {
          clearInterval(checkLoaded);
          isLoading = false;
          isLoaded = true;
          resolve();
          callbacks.forEach(cb => cb());
          callbacks.length = 0;
        }
      }, 100);
      
      // Timeout after 10 seconds
      setTimeout(() => {
        if (isLoading) {
          clearInterval(checkLoaded);
          isLoading = false;
          reject(new Error('Timeout loading Google Maps API'));
        }
      }, 10000);
      
      return;
    }

    // Load the script
    isLoading = true;
    const script = document.createElement('script');
    const librariesParam = libraries.length > 0 ? `&libraries=${libraries.join(',')}` : '';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}${librariesParam}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      isLoading = false;
      isLoaded = true;
      resolve();
      callbacks.forEach(cb => cb());
      callbacks.length = 0;
    };

    script.onerror = () => {
      isLoading = false;
      reject(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);
  });
};

/**
 * Check if Google Maps API is already loaded
 */
export const isGoogleMapsLoaded = (): boolean => {
  return typeof window !== 'undefined' && 
    (!!(window as any).google?.maps || !!(window as any).google?.maps?.importLibrary);
};

