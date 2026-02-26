import {
  getCollectionItems,
  COLLECTIONS,
  Property,
  Location,
  Room,
  Occupant,
} from "@/lib/webflow";
import { sortProperties } from "@/lib/property-utils";
import { CampaignHero } from "./CampaignHero";
import { CampaignListBanner } from "./CampaignListBanner";
import { HSRPropertyGrid } from "./HSRPropertyGrid";
import { HSRHowItWorks } from "./HSRHowItWorks";
import { CampaignBottomNav } from "./CampaignBottomNav";
import { AsSeenIn } from "@/components/layout/AsSeenIn";
import { Neighborhoods } from "@/app/(Homepage)/sections/Neighborhoods";
import type { Metadata } from "next";

const HSR_LAYOUT_SLUG = "hsr-layout";

export const metadata: Metadata = {
  title: "Homes in HSR Layout | Flent",
  description:
    "Explore fully furnished Flent homes in HSR Layout, Bengaluru. Bespoke rentals with up to ₹6,000 off. No broker hassles, minimal security deposit. Move in within 3 days.",
  openGraph: {
    title: "Homes in HSR Layout | Flent",
    description:
      "Explore fully furnished Flent homes in HSR Layout, Bengaluru. Bespoke rentals with up to ₹6,000 off. No broker hassles, minimal security deposit.",
    url: "https://www.flent.in/collections/hsr-layout",
    type: "website",
    images: "https://www.flent.in/images/og-image.jpg",
  },
  twitter: {
    card: "summary_large_image",
    title: "Homes in HSR Layout | Flent",
    description:
      "Explore fully furnished Flent homes in HSR Layout, Bengaluru. Bespoke rentals with up to ₹6,000 off.",
    images: "https://www.flent.in/images/og-image.jpg",
  },
};

export default async function HSRLayoutCampaignPage() {
  const [properties, locations, rooms, occupants] = await Promise.all([
    getCollectionItems<Property>(COLLECTIONS.PROPERTIES),
    getCollectionItems<Location>(COLLECTIONS.LOCATIONS),
    getCollectionItems<Room>(COLLECTIONS.ROOMS),
    getCollectionItems<Occupant>(COLLECTIONS.OCCUPANTS),
  ]);

  const hsrLocation = locations.find(
    (l) => l.fieldData.slug === HSR_LAYOUT_SLUG
  );

  const hsrProperties = properties
    .filter(
      (p) =>
        hsrLocation &&
        p.fieldData.location === hsrLocation.id &&
        !p.fieldData["is-upcoming"]
    )
    .sort(sortProperties);

  const availableProperties = hsrProperties.filter(
    (p) => p.fieldData.available === true
  );
  const unavailableProperties = hsrProperties.filter(
    (p) => p.fieldData.available !== true
  );
  const orderedProperties = [
    ...availableProperties.sort(sortProperties),
    ...unavailableProperties.sort(sortProperties),
  ];

  return (
    <main className="min-h-screen bg-bg-white flex flex-col">
      <CampaignHero />
      <HSRPropertyGrid
        properties={orderedProperties}
        rooms={rooms}
        occupants={occupants}
        listBanner={<CampaignListBanner />}
      />
      <section className="py-12">
        <AsSeenIn />
      </section>
      <HSRHowItWorks />
      <Neighborhoods locations={locations} properties={properties} />

      <CampaignBottomNav />
    </main>
  );
}
