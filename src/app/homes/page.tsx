import { Suspense } from "react";
import { getCollectionItems, COLLECTIONS, Property, Location, Review, Room, Occupant } from "@/lib/webflow";
import { OpenSection } from "@/components/layout/OpenSection";
import { PropertyBrowser } from "./PropertyBrowser";
import { Rating } from "@/components/ui/Rating";

export default async function PropertiesPage() {
    const [properties, locations, reviews, rooms, occupants] = await Promise.all([
        getCollectionItems<Property>(COLLECTIONS.PROPERTIES),
        getCollectionItems<Location>(COLLECTIONS.LOCATIONS),
        getCollectionItems<Review>(COLLECTIONS.REVIEWS),
        getCollectionItems<Room>(COLLECTIONS.ROOMS),
        getCollectionItems<Occupant>(COLLECTIONS.OCCUPANTS)
    ]);

    return (
        <main className="bg-bg-white">
            <OpenSection className="py-10  pb-0">
                <div className="container mx-auto px-4 text-center mt-24">
                    <h1 className="text-fluid-h1 font-heading text-text-main mb-4">
                        Our <span className="font-zin font-light"> <br />Homes</span>
                    </h1>
                    <p className="text-subtitle font-body font-medium max-w-2xl mx-auto">
                        Homes that are fully furnished, <br />thoughtfully set up, and ready from day one.
                    </p>
                </div>
            </OpenSection>

            <Suspense fallback={
                <div className="container mx-auto px-4 py-20 text-center">
                    <p className="text-xl text-text-main/60">Loading properties...</p>
                </div>
            }>
                <PropertyBrowser properties={properties} locations={locations} rooms={rooms} occupants={occupants} />
            </Suspense>
            <Rating reviews={reviews} />
        </main>
    );
}
