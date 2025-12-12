import { Suspense } from "react";
import {
  getCollectionItems,
  COLLECTIONS,
  Property,
  Location,
  Review,
  Room,
  Occupant,
} from "@/lib/webflow";
import { OpenSection } from "@/components/layout/OpenSection";
import { PropertyBrowser } from "./PropertyBrowser";
import { Rating } from "@/components/ui/Rating";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Homes | Flent",
  description: "Explore fully furnished, move in ready Flent homes across Bengaluru with no broker hassles. Filter by budget, neighbourhood, and move in date to find a home ready from day one.",
  openGraph: {
    title: "Our Homes | Flent",
    description: "Explore fully furnished, move in ready Flent homes across Bengaluru with no broker hassles. Filter by budget, neighbourhood, and move in date to find a home ready from day one.",
    url: "https://www.flent.in/homes",
    type: "website",
    images: "https://www.flent.in/images/og-image.jpg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Our Homes | Flent",
    description: "Explore fully furnished, move in ready Flent homes across Bengaluru with no broker hassles. Filter by budget, neighbourhood, and move in date to find a home ready from day one.",
    images: "https://www.flent.in/images/og-image.jpg",
  },
};

export default async function PropertiesPage() {
  const [properties, locations, reviews, rooms, occupants] = await Promise.all([
    getCollectionItems<Property>(COLLECTIONS.PROPERTIES),
    getCollectionItems<Location>(COLLECTIONS.LOCATIONS),
    getCollectionItems<Review>(COLLECTIONS.REVIEWS),
    getCollectionItems<Room>(COLLECTIONS.ROOMS),
    getCollectionItems<Occupant>(COLLECTIONS.OCCUPANTS),
  ]);

  console.log(properties);

  return (
    <main className="bg-bg-white">
      <OpenSection className="py-10  pb-0">
        <div className="container mx-auto px-4 text-center mt-24">
          <h1 className="text-fluid-h1 font-heading text-text-main mb-4">
          Move in ready homes{" "}
            <span className="font-zin-italic">
              {" "}
              <br className="hidden md:block" />
              for you
            </span>
          </h1>
          <p className="text-subtitle font-body font-medium max-w-2xl mx-auto">
          Start your search here <br className="hidden md:block" />
          Choose a location and move in date to see what's available
          </p>
        </div>
      </OpenSection>

      <Suspense
        fallback={
          <div className="container mx-auto px-4 py-20 text-center">
            <p className="text-xl text-text-main/60">Loading properties...</p>
          </div>
        }
      >
        <PropertyBrowser
          properties={properties}
          locations={locations}
          rooms={rooms}
          occupants={occupants}
        />
      </Suspense>
      <Rating reviews={reviews} />
    </main>
  );
}
