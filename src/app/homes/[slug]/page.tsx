import { getCollectionItems, COLLECTIONS, Property, Location, Review, Amenity, Room, Occupant } from "@/lib/webflow";
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

const baseTitle = "Flent | India's New Standard of Renting";
const baseDescription = "Unlock India's top 1% rental homes with Flent. Fully furnished, designer homes with no broker hassles and minimal security deposit. Just bring your clothes, and you're home.";

export async function generateStaticParams() {
    const properties = await getCollectionItems<Property>(COLLECTIONS.PROPERTIES);
    return properties.map((property) => ({
        slug: property.fieldData.slug,
    }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
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
    const description = property.fieldData["property-description"] || property.fieldData["property-long-description"] || baseDescription;
    
    // Use property featured photo or thumbnail for OG image
    const ogImage = property.fieldData["property-featured-photo"]?.url 
        || property.fieldData["property-thumbnail"]?.url 
        || "/images/og-image.jpg";

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
}

export default async function PropertyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const properties = await getCollectionItems<Property>(COLLECTIONS.PROPERTIES);
    const locations = await getCollectionItems<Location>(COLLECTIONS.LOCATIONS);
    const reviews = await getCollectionItems<Review>(COLLECTIONS.REVIEWS);
    const allAmenities = await getCollectionItems<Amenity>(COLLECTIONS.AMENITIES);
    const allRooms = await getCollectionItems<Room>(COLLECTIONS.ROOMS);
    const allOccupants = await getCollectionItems<Occupant>(COLLECTIONS.OCCUPANTS);

    const property = properties.find((p) => p.fieldData.slug === slug);

    if (!property) {
        return <div>Property not found</div>;
    }

    const location = locations.find((l) => l.id === property.fieldData.location);


    // Filter amenities for this property
    const propertyAmenityIds = property.fieldData.amenities || [];
    const propertyAmenities = allAmenities.filter(amenity =>
        propertyAmenityIds.includes(amenity.id)
    );

    // Filter rooms for this property
    const propertyRoomIds = property.fieldData.rooms || [];
    const propertyRooms = allRooms.filter(room =>
        propertyRoomIds.includes(room.id)
    );

    // Pass all occupants - the components lookup occupants using room.fieldData.occupant
    // (room -> occupant direction) which is the source of truth.
    // Filtering by occupant.fieldData.room creates mismatches since bidirectional refs in Webflow aren't consistent.
    const propertyOccupants = allOccupants;

    // Filter properties in the same neighborhood (excluding current property)
    const neighborhoodProperties = properties.filter(p =>
        p.fieldData.location === location?.id && p.id !== property.id
    );



    // Calculate image data for the property
    const { allImages, photoCategories } = getPropertyImagesData(property, propertyRooms);

    return (
        <main className="min-h-screen bg-bg-white pb-24">
            {location && <BreadcrumbSetter neighborhoodName={location.fieldData.name} neighborhoodId={location.id} />}
            <section id="overview">
                <Header
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
                />
            </section>

            <section id="amenities">
                <Amenities
                    property={property}
                    amenities={propertyAmenities}
                    allImages={allImages}
                />
            </section>



            <section id="neighborhood">
                <Neighborhood property={property} location={location} neighborhoodProperties={neighborhoodProperties} />
            </section>

            <section id="flent-compare">
                <FlentCompare />
            </section>

            <section id="how-it-works">
                <HowItWorks />
            </section>

            <MarqueeSection />

            <section id="reviews">
                <Rating reviews={reviews} />
            </section>

            <section id="faq">
                <FAQ />
            </section>



            <MoreOptions properties={properties} currentPropertyId={property.id} />

            <BottomNavigation />
        </main>
    );
}

