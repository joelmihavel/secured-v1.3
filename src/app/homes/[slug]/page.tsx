import {
  getCollectionItems,
  COLLECTIONS,
  Property,
  Location,
  Review,
  Amenity,
  Room,
  Occupant,
} from "@/lib/webflow";
import { getPropertyImagesData } from "@/lib/property-utils";
import { Header } from "./sections/Header";
import { RoomSelection } from "./sections/RoomSelection";
import { Neighborhood } from "./sections/Neighborhood";
import { FlentCompare } from "./sections/FlentCompare";
import { Rating } from "@/components/ui/Rating";
import { FAQ } from "./sections/FAQ";
import { MoreOptions } from "./sections/MoreOptions";
import { MarqueeSection } from "@/app/(Homepage)/sections/MarqueeSection";
import { BottomNavigation } from "@/components/ui/BottomNavigation";
import { BreadcrumbSetter } from "@/components/utils/BreadcrumbSetter";
import { Amenities } from "./sections/Amenities";
import { HowItWorks } from "./sections/HowItWorks";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

const baseTitle = "Flent | India's New Standard of Renting";
const baseDescription =
  "Unlock India's top 1% rental homes with Flent. Fully furnished, designer homes with no broker hassles and minimal security deposit. Just bring your clothes, and you're home.";

export async function generateStaticParams() {
  const properties = await getCollectionItems<Property>(COLLECTIONS.PROPERTIES);
  return properties.map((property) => ({
    slug: property.fieldData.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const properties = await getCollectionItems<Property>(COLLECTIONS.PROPERTIES);
    const property = properties.find((p) => p.fieldData.slug === slug);

    if (!property) {
      return {
        title: baseTitle,
        description: baseDescription,
      };
    }

    const propertyName = property.fieldData.name;
    const title = `${propertyName} | ${baseTitle}`;
    const description =
      property.fieldData["property-description"] ||
      property.fieldData["property-long-description"] ||
      baseDescription;

    // Use property featured photo or thumbnail for OG image
    const ogImage =
      property.fieldData["property-featured-photo"]?.url ||
      property.fieldData["property-thumbnail"]?.url ||
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.flent.in"}/images/og-image.jpg`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        images: ogImage,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: ogImage,
      },
    };
  } catch {
    // On API failure, return default metadata (don't block rendering)
    return {
      title: baseTitle,
      description: baseDescription,
    };
  }
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [properties, locations, reviews, allAmenities, allRooms, allOccupants] =
    await Promise.all([
      getCollectionItems<Property>(COLLECTIONS.PROPERTIES),
      getCollectionItems<Location>(COLLECTIONS.LOCATIONS),
      getCollectionItems<Review>(COLLECTIONS.REVIEWS),
      getCollectionItems<Amenity>(COLLECTIONS.AMENITIES),
      getCollectionItems<Room>(COLLECTIONS.ROOMS),
      getCollectionItems<Occupant>(COLLECTIONS.OCCUPANTS),
    ]);

  const property = properties.find((p) => p.fieldData.slug === slug);

  if (!property) {
    notFound();
  }

  const location = locations.find((l) => l.id === property.fieldData.location);

  // Filter amenities for this property
  const propertyAmenityIds = property.fieldData.amenities || [];
  const propertyAmenities = allAmenities.filter((amenity) =>
    propertyAmenityIds.includes(amenity.id)
  );

  // Filter rooms for this property
  const propertyRoomIds = property.fieldData.rooms || [];
  const propertyRooms = allRooms.filter((room) =>
    propertyRoomIds.includes(room.id)
  );

  // Pass all occupants - the components lookup occupants using room.fieldData.occupant
  // (room -> occupant direction) which is the source of truth.
  // Filtering by occupant.fieldData.room creates mismatches since bidirectional refs in Webflow aren't consistent.
  const propertyOccupants = allOccupants;

  // Filter properties in the same neighborhood (excluding current property)
  const neighborhoodProperties = properties.filter(
    (p) =>
      p.fieldData.location === location?.id &&
      p.id !== property.id &&
      p.fieldData["is-upcoming"] === false
  );

  // Calculate image data for the property
  const { allImages, photoCategories } = getPropertyImagesData(
    property,
    propertyRooms
  );

  return (
    <main className="min-h-screen bg-bg-white flex flex-col gap-12">
      {location && (
        <BreadcrumbSetter
          neighborhoodName={location.fieldData.name}
          neighborhoodId={location.id}
        />
      )}
      <section id="overview">
        <Header
        rooms={propertyRooms}
          property={property}
          amenities={propertyAmenities}
          allImages={allImages}
          photoCategories={photoCategories}
          locationName={location?.fieldData.name}
        />
      </section>

      <section id="rooms">
        <RoomSelection
          property={property}
          rooms={propertyRooms}
          occupants={propertyOccupants}
          allImages={allImages}
          photoCategories={photoCategories}
          slug={slug}
        />
      </section>

      <section id="amenities">
        <Amenities
          property={property}
          amenities={propertyAmenities}
          allImages={allImages}
          slug={slug}
        />
      </section>

      <section id="neighborhood">
        <Neighborhood
          property={property}
          location={location}
          neighborhoodProperties={neighborhoodProperties}
        />
      </section>

      <section id="faq">
        <FAQ />
      </section>

      <section id="flent-compare">
        <FlentCompare />
      </section>

      <section id="how-it-works">
        <HowItWorks propertyName={property.fieldData.name} />
      </section>

      <MarqueeSection />

      <section id="reviews">
        <Rating reviews={reviews} />
      </section>

      <MoreOptions 
        properties={properties} 
        currentPropertyId={property.id}
        rooms={allRooms}
        occupants={allOccupants}
      />

      <BottomNavigation property={property} showCallButton />
    </main>
  );
}
