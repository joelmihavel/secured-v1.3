"use client";

import { useEffect } from "react";
import { trackPropertyPageView } from "@/lib/posthog-tracking";
import type { PropertyTypeFilter } from "@/lib/posthog-tracking";

interface PropertyPageViewTrackerProps {
  propertySlug: string;
  propertyType: PropertyTypeFilter;
  propertyArea?: string;
}

/**
 * Fires property_page_viewed once when the property detail page is viewed.
 * Rendered by the server page with slug and property_type (discounted | standard).
 */
export function PropertyPageViewTracker({
  propertySlug,
  propertyType,
  propertyArea,
}: PropertyPageViewTrackerProps) {
  useEffect(() => {
    trackPropertyPageView({
      property_slug: propertySlug,
      property_type: propertyType,
      property_area: propertyArea,
    });
  }, [propertySlug, propertyType, propertyArea]);

  return null;
}
