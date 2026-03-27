import {
  getCollectionItems,
  COLLECTIONS,
  Property,
  Location,
  Review,
  Room,
  Occupant,
} from "@/lib/webflow";
import Link from "next/link";
import { OpenSection } from "@/components/layout/OpenSection";
import { ComingSoon } from "@/app/(Homepage)/sections/ComingSoon";
import { PropertyCard } from "@/components/ui/PropertyCard";
import { Rating } from "@/components/ui/Rating";
import {
  propertyHasDiscount,
  isPropertyActive,
  isUpcomingProperty,
  sortByAvailabilityThenRank,
} from "@/lib/property-utils";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Deals | Flent",
  description:
    "Explore discounted, fully furnished, move in ready Flent homes across Bengaluru. Filter by budget, neighbourhood, and move in date to find your best deal.",
  openGraph: {
    title: "Deals | Flent",
    description:
      "Explore discounted, fully furnished, move in ready Flent homes across Bengaluru. Filter by budget, neighbourhood, and move in date to find your best deal.",
    url: "https://www.flent.in/deals",
    type: "website",
    images: "https://www.flent.in/images/og-image.jpg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Deals | Flent",
    description:
      "Explore discounted, fully furnished, move in ready Flent homes across Bengaluru. Filter by budget, neighbourhood, and move in date to find your best deal.",
    images: "https://www.flent.in/images/og-image.jpg",
  },
};

export default async function DealsPage() {
  const [properties, locations, reviews, rooms, occupants] = await Promise.all([
    getCollectionItems<Property>(COLLECTIONS.PROPERTIES),
    getCollectionItems<Location>(COLLECTIONS.LOCATIONS),
    getCollectionItems<Review>(COLLECTIONS.REVIEWS),
    getCollectionItems<Room>(COLLECTIONS.ROOMS),
    getCollectionItems<Occupant>(COLLECTIONS.OCCUPANTS),
  ]);

  const locationMap = new Map(
    locations.map((location) => [location.id, location.fieldData.name])
  );
  const discountedProperties = properties
    .filter((property) => {
      if (!isPropertyActive(property)) return false;
      if (isUpcomingProperty(property)) return false;
      return propertyHasDiscount(property);
    })
    .sort(sortByAvailabilityThenRank);

  return (
    <main className="bg-bg-white">
      <OpenSection className="py-10  pb-0">
        <div className="container mx-auto px-4 text-center mt-24">
          <h1 className="text-fluid-h1 font-heading text-brand-yellow mb-4 bg-forest-green rounded-xl min-h-[8rem] md:min-h-[10rem] flex items-center justify-center px-4">
            Great deals! Zero Compromises.
          </h1>
        </div>
      </OpenSection>

      <OpenSection className="pt-0">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {discountedProperties.map((property) => {
              const locationId = property.fieldData.location;
              const locationName = locationId
                ? locationMap.get(locationId)
                : undefined;

              return (
                <Link
                  key={property.id}
                  href={`/homes/${property.fieldData.slug}`}
                  className="block h-full"
                >
                  <PropertyCard
                    property={property}
                    locationName={locationName}
                    rooms={rooms}
                    occupants={occupants}
                  />
                </Link>
              );
            })}
            {discountedProperties.length === 0 && (
              <div className="col-span-full">
                <ComingSoon
                  properties={properties}
                  locations={locations}
                  rooms={rooms}
                  occupants={occupants}
                  title="No deals available right now"
                  subtitle="We are adding new discounted homes soon. Get notified when deals go live."
                  newsletterHeading="Want an email when new deals are live?"
                />
              </div>
            )}
          </div>
        </div>
      </OpenSection>
      <Rating reviews={reviews} />
    </main>
  );
}
