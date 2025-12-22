"use client";

import {
  Map,
  Marker,
  InfoWindow,
  useMap,
} from "@vis.gl/react-google-maps";
import { useState, useEffect, useRef } from "react";
import { trackEvent } from "@/lib/posthog-tracking";

interface GoogleMapProps {
  center: [number, number];
  zoom: number;
  mainProperty: { lat: number; lng: number; name: string };
  neighbors: { lat: number; lng: number; name: string; slug: string }[];
  apiKey: string;
  selectedPlace?: { lat: number; lng: number; name: string } | null;
  onDirectionsResult?: (distance: string, duration: string) => void;
}

// Component to handle directions rendering
function DirectionsRenderer({
  origin,
  destination,
  onDirectionsResult,
}: {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  onDirectionsResult?: (distance: string, duration: string) => void;
}) {
  const map = useMap();
  const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(
    null
  );
  const directionsServiceRef = useRef<google.maps.DirectionsService | null>(
    null
  );
  const lastOriginRef = useRef<string>("");
  const lastDestinationRef = useRef<string>("");
  const callbackRef = useRef(onDirectionsResult);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = onDirectionsResult;
  }, [onDirectionsResult]);

  useEffect(() => {
    if (!map || typeof window === "undefined" || !window.google?.maps) return;

    const originKey = `${origin.lat},${origin.lng}`;
    const destinationKey = `${destination.lat},${destination.lng}`;

    // Check if we need to update (only if origin or destination changed)
    if (
      lastOriginRef.current === originKey &&
      lastDestinationRef.current === destinationKey &&
      directionsRendererRef.current
    ) {
      return; // No change, skip re-rendering
    }

    // Update refs
    lastOriginRef.current = originKey;
    lastDestinationRef.current = destinationKey;

    // Initialize directions service (only once)
    if (!directionsServiceRef.current) {
      directionsServiceRef.current = new window.google.maps.DirectionsService();
    }

    // Initialize or reuse directions renderer
    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer(
        {
          map,
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: "#3b82f6",
            strokeWeight: 5,
            strokeOpacity: 0.8,
          },
        }
      );
    } else {
      // Ensure renderer is attached to map
      directionsRendererRef.current.setMap(map);
    }

    // Request directions
    directionsServiceRef.current.route(
      {
        origin: new window.google.maps.LatLng(origin.lat, origin.lng),
        destination: new window.google.maps.LatLng(
          destination.lat,
          destination.lng
        ),
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (
          status === window.google.maps.DirectionsStatus.OK &&
          directionsRendererRef.current &&
          result
        ) {
          directionsRendererRef.current.setDirections(result);

          // Extract distance and duration from the result
          if (result.routes && result.routes.length > 0) {
            const route = result.routes[0];
            if (route.legs && route.legs.length > 0) {
              const leg = route.legs[0];
              const distance = leg.distance?.text || "";
              const duration = leg.duration?.text || "";

              if (callbackRef.current && distance && duration) {
                callbackRef.current(distance, duration);
              }
            }
          }
        } else {
          console.error("Directions request failed:", status);
          if (callbackRef.current) {
            callbackRef.current("", "");
          }
        }
      }
    );

    // Cleanup only on unmount
    return () => {
      // Don't destroy on every render, only on unmount
    };
  }, [map, origin.lat, origin.lng, destination.lat, destination.lng]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (directionsRendererRef.current) {
        directionsRendererRef.current.setMap(null);
        directionsRendererRef.current = null;
      }
    };
  }, []);

  return null;
}

const GoogleMap = ({
  center,
  zoom,
  mainProperty,
  neighbors,
  apiKey,
  selectedPlace,
  onDirectionsResult,
}: GoogleMapProps) => {
  const [selectedNeighbor, setSelectedNeighbor] = useState<number | null>(null);

  return (
    <Map
      defaultCenter={{ lat: center[0], lng: center[1] }}
      defaultZoom={zoom}
      mapId="neighborhood-map"
      style={{ width: "100%", height: "100%" }}
      gestureHandling="cooperative"
      disableDefaultUI={false}
    >
      {/* Marker for main property */}
      <Marker
        position={{ lat: mainProperty.lat, lng: mainProperty.lng }}
        title={mainProperty.name}
        icon={"/images/map-marker-primary.svg"}
      />

      {/* Marker for selected place */}
      {selectedPlace && (
        <Marker
          position={{ lat: selectedPlace.lat, lng: selectedPlace.lng }}
          title={selectedPlace.name}
          icon={
            typeof window !== "undefined" && window.google?.maps?.SymbolPath
              ? {
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#3b82f6",
                fillOpacity: 1,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }
              : undefined
          }
        />
      )}

      {/* Directions from selected place to main property */}
      {selectedPlace && (
        <DirectionsRenderer
          origin={selectedPlace}
          destination={mainProperty}
          onDirectionsResult={onDirectionsResult}
        />
      )}

      {/* Markers for neighbors */}
      {neighbors.map((neighbor, idx) => (
        <Marker
          key={idx}
          position={{ lat: neighbor.lat, lng: neighbor.lng }}
          title={neighbor.name}
          onClick={() => {
            setSelectedNeighbor(idx);
            trackEvent('Google Maps Interaction', {
              action: 'marker_click',
              marker_name: neighbor.name,
              marker_type: 'neighbor'
            });
          }}
          icon={"/images/map-marker-secondary.svg"}
        />
      ))}

      {/* InfoWindow for selected neighbor */}
      {selectedNeighbor !== null && neighbors[selectedNeighbor] && (
        <InfoWindow
          position={{
            lat: neighbors[selectedNeighbor].lat,
            lng: neighbors[selectedNeighbor].lng,
          }}
          onCloseClick={() => setSelectedNeighbor(null)}
          headerContent={
            <a
              href={`/homes/${neighbors[selectedNeighbor].slug}`}
              className="font-bold text-blue-600 hover:underline"
            >
              {neighbors[selectedNeighbor].name}
            </a>
          }
        ></InfoWindow>
      )}
    </Map>
  );
};

export default GoogleMap;
