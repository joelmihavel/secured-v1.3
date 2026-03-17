import type {
  Amenity,
  Location,
  Occupant,
  Property,
  Review,
  Room,
} from "@/lib/webflow";
import { WEBFLOW_BACKGROUND_COLOUR_MAP } from "@/lib/webflow";
import {
  getDiscountEndDateFormatted,
  getPropertyImagesData,
  getRibbonDiscountSavings,
  isPropertyActive,
  propertyHasDiscount,
} from "@/lib/property-utils";
import type { PropertyTypeFilter } from "@/lib/posthog-tracking";

export function buildPropertyPageContext({
  slug,
  properties,
  locations,
  reviews,
  amenities,
  rooms,
  occupants,
}: {
  slug: string;
  properties: Property[];
  locations: Location[];
  reviews: Review[];
  amenities: Amenity[];
  rooms: Room[];
  occupants: Occupant[];
}) {
  const property = properties.find((p) => p.fieldData.slug === slug);

  const isValidProperty = Boolean(property && isPropertyActive(property));
  const location = property
    ? locations.find((l) => l.id === property.fieldData.location)
    : undefined;

  const propertyAmenityIds = property?.fieldData.amenities || [];
  const propertyAmenities = amenities.filter((amenity) =>
    propertyAmenityIds.includes(amenity.id)
  );

  const propertyRoomIds = property?.fieldData.rooms || [];
  const propertyRooms = rooms.filter((room) => propertyRoomIds.includes(room.id));

  const propertyOccupants = occupants;

  const neighborhoodProperties = properties.filter(
    (p) =>
      isPropertyActive(p) &&
      p.fieldData.location === location?.id &&
      p.id !== property?.id &&
      p.fieldData["is-upcoming"] === false
  );

  const { allImages, photoCategories } = property
    ? getPropertyImagesData(property, propertyRooms)
    : { allImages: [], photoCategories: [] };

  const propertyType: PropertyTypeFilter =
    property && propertyHasDiscount(property) ? "discounted" : "standard";

  const hasDiscount = Boolean(property && propertyHasDiscount(property));
  const discountSavings = property ? getRibbonDiscountSavings(property, rooms) : 0;
  const discountEndDate = property ? getDiscountEndDateFormatted(property) : null;

  const backgroundColourId = property?.fieldData["background-colour-2"];
  const backgroundClass = backgroundColourId
    ? WEBFLOW_BACKGROUND_COLOUR_MAP[backgroundColourId]
    : undefined;

  const marqueeStarFill = (() => {
    switch (backgroundClass) {
      case "bg-forest-green":
        return "var(--color-forest-green)";
      case "bg-ground-brown":
        return "var(--color-ground-brown)";
      case "bg-brick-red":
        return "var(--color-brick-red)";
      case "bg-night-violet":
        return "var(--color-night-violet)";
      case "bg-brand-pink":
        return "var(--color-brand-pink)";
      case "bg-brand-orange":
        return "var(--color-brand-orange)";
      case "bg-brand-cyan":
        return "var(--color-brand-cyan)";
      case "bg-brand-yellow":
        return "var(--color-brand-yellow)";
      default:
        return "var(--color-bg-white)";
    }
  })();

  return {
    property,
    isValidProperty,
    location,
    reviews,
    propertyAmenities,
    propertyRooms,
    propertyOccupants,
    neighborhoodProperties,
    allImages,
    photoCategories,
    propertyType,
    hasDiscount,
    discountSavings,
    discountEndDate,
    backgroundClass,
    marqueeStarFill,
  };
}

