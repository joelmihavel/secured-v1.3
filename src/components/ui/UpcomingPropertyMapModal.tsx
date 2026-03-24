"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/Button";
import { CTA_IDS } from "@/lib/cta-ids";
import { cn } from "@/lib/utils";
import {
  trackUpcomingMapCtaClicked,
  trackUpcomingMapInteraction,
  trackUpcomingMapModalClosed,
  trackUpcomingMapModalOpened,
  UpcomingMapCloseSource,
} from "@/lib/posthog-tracking";

const GoogleMap = dynamic(() => import("@/components/ui/GoogleMap"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-black/5 text-sm text-text-main/60">
      Loading map...
    </div>
  ),
});

const GOOGLE_MAPS_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

interface UpcomingPropertyMapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGetLaunchInvite: () => void;
  propertyId?: string;
  propertyName: string;
  propertyTitle: string;
  locationName: string;
  latitude: number;
  longitude: number;
  onMapSessionStart?: (mapSessionId: string) => void;
}

function createMapSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `map_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

export const UpcomingPropertyMapModal = ({
  isOpen,
  onClose,
  onGetLaunchInvite,
  propertyId,
  propertyName,
  propertyTitle,
  locationName,
  latitude,
  longitude,
  onMapSessionStart,
}: UpcomingPropertyMapModalProps) => {
  const hasCoordinates = latitude !== 0 && longitude !== 0;
  const [mapSessionId, setMapSessionId] = useState<string | null>(null);
  const [interactionCount, setInteractionCount] = useState(0);
  const openAtRef = useRef<number | null>(null);
  const closeSourceRef = useRef<UpcomingMapCloseSource>("overlay");
  const closeTrackedRef = useRef(false);

  const basePayload = useMemo(() => {
    if (!mapSessionId) return null;
    return {
      surface: "coming_soon_card" as const,
      map_session_id: mapSessionId,
      property_id: propertyId,
      property_name: propertyName,
      location_name: locationName,
      lat: latitude,
      lng: longitude,
    };
  }, [latitude, locationName, longitude, mapSessionId, propertyId, propertyName]);

  const trackCloseOnce = (source: UpcomingMapCloseSource) => {
    if (closeTrackedRef.current || !basePayload) return;
    closeTrackedRef.current = true;
    const openedAt = openAtRef.current;
    trackUpcomingMapModalClosed({
      ...basePayload,
      close_source: source,
      time_in_modal_ms: openedAt ? Date.now() - openedAt : undefined,
      interaction_count: interactionCount,
    });
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("notification-modal-open");
      const nextMapSessionId = createMapSessionId();
      setMapSessionId(nextMapSessionId);
      setInteractionCount(0);
      closeSourceRef.current = "overlay";
      closeTrackedRef.current = false;
      openAtRef.current = Date.now();
      onMapSessionStart?.(nextMapSessionId);
      trackUpcomingMapModalOpened({
        surface: "coming_soon_card",
        map_session_id: nextMapSessionId,
        source_cta_id: CTA_IDS.VIEW_ON_MAPS_COMING_SOON,
        property_id: propertyId,
        property_name: propertyName,
        location_name: locationName,
        lat: latitude,
        lng: longitude,
      });
      trackUpcomingMapInteraction({
        surface: "coming_soon_card",
        map_session_id: nextMapSessionId,
        interaction_type: "map_loaded",
        property_id: propertyId,
        property_name: propertyName,
        location_name: locationName,
        lat: latitude,
        lng: longitude,
      });
      return () => {
        document.body.classList.remove("notification-modal-open");
      };
    }
    document.body.classList.remove("notification-modal-open");
    setMapSessionId(null);
    openAtRef.current = null;
    return undefined;
  }, [
    isOpen,
    latitude,
    locationName,
    longitude,
    onMapSessionStart,
    propertyId,
    propertyName,
  ]);

  return (
    <DialogPrimitive.Root
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          trackCloseOnce(closeSourceRef.current);
          onClose();
        }
      }}
    >
      <AnimatePresence>
        {isOpen && (
          <DialogPrimitive.Portal forceMount>
            <DialogPrimitive.Overlay asChild>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-[190] bg-black/80"
              />
            </DialogPrimitive.Overlay>

            <DialogPrimitive.Content
              asChild
              onEscapeKeyDown={() => {
                closeSourceRef.current = "esc";
              }}
              onPointerDownOutside={() => {
                closeSourceRef.current = "overlay";
              }}
            >
              <motion.div
                initial={{ opacity: 0, y: "20%", x: "-50%" }}
                animate={{ opacity: 1, y: 0, x: "-50%" }}
                exit={{ opacity: 0, y: "20%", x: "-50%" }}
                transition={{ type: "spring", stiffness: 280, damping: 28 }}
                className={cn(
                  "fixed left-1/2 z-[200] w-[calc(100vw-0.75rem)] max-w-none border border-black/20 bg-[#ECE8E5] px-4 pb-6 pt-5 shadow-lg",
                  "bottom-2 rounded-[2.5rem] md:top-1/2 md:bottom-auto md:w-[40rem] md:max-w-[90vw] md:-translate-y-1/2 md:rounded-[1.5rem] md:px-6"
                )}
              >
                <div className="mx-auto mb-4 h-1.5 w-16 rounded-full bg-text-main/90 md:hidden" />

                <DialogPrimitive.Title className="text-center font-zin text-fluid-h3 text-text-main">
                  {propertyTitle} in {locationName}
                </DialogPrimitive.Title>

                <div className="mt-4 overflow-hidden rounded-md border border-black">
                  <div className="h-[340px] w-full md:h-[360px]">
                    {hasCoordinates ? (
                      <GoogleMap
                        center={[latitude, longitude]}
                        zoom={14}
                        mainProperty={{
                          lat: latitude,
                          lng: longitude,
                          name: propertyTitle,
                        }}
                        neighbors={[]}
                        apiKey={GOOGLE_MAPS_API_KEY}
                        onInteraction={(interaction) => {
                          if (!basePayload) return;
                          setInteractionCount((current) => current + 1);
                          trackUpcomingMapInteraction({
                            ...basePayload,
                            interaction_type: interaction.interaction_type,
                            zoom_level: interaction.zoom_level,
                            marker_name: interaction.marker_name,
                          });
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-black/5 text-sm text-text-main/70">
                        Map not available
                      </div>
                    )}
                  </div>
                </div>

                <p className="mt-4 text-center font-body text-base text-text-main">
                  Fits your preferred area? Get notified when{" "}
                  <span className="font-semibold text-forest-green">
                    {propertyTitle}
                  </span>{" "}
                  launches!
                </p>

                <div className="mt-5 flex flex-col gap-3">
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    data-cta-id={CTA_IDS.PROPERTY_GET_LAUNCH_INVITE}
                    data-cta-context="upcoming_map_modal"
                    onClick={() => {
                      if (basePayload) {
                        trackUpcomingMapCtaClicked({
                          ...basePayload,
                          cta_type: "get_launch_invite",
                          cta_id: CTA_IDS.PROPERTY_GET_LAUNCH_INVITE,
                        });
                        trackCloseOnce("primary_cta");
                      }
                      onGetLaunchInvite();
                    }}
                  >
                    Get Launch Invite
                  </Button>

                  <button
                    type="button"
                    onClick={() => {
                      if (basePayload) {
                        trackUpcomingMapCtaClicked({
                          ...basePayload,
                          cta_type: "go_back",
                        });
                      }
                      closeSourceRef.current = "go_back";
                      trackCloseOnce("go_back");
                      onClose();
                    }}
                    className="w-full text-center font-heading text-button-link text-text-main md:hidden"
                  >
                    Go back
                  </button>
                </div>
              </motion.div>
            </DialogPrimitive.Content>
          </DialogPrimitive.Portal>
        )}
      </AnimatePresence>
    </DialogPrimitive.Root>
  );
};
