import { Hero } from "./sections/Hero";
import { Homes } from "./sections/Homes";
import { Info } from "./sections/Info";
import { MarqueeSection } from "./sections/MarqueeSection";
import { Neighborhoods } from "./sections/Neighborhoods";
import { Community } from "./sections/Community";
import { ComingSoon } from "./sections/ComingSoon";
import { getCollectionItems, COLLECTIONS, Property, Location, Room, Occupant } from "@/lib/webflow";

import { AsSeenIn } from "@/components/layout/AsSeenIn";

export default async function Home() {
  // Fetch all collections in parallel for better performance
  const [properties, locations, rooms, occupants] = await Promise.all([
    getCollectionItems<Property>(COLLECTIONS.PROPERTIES),
    getCollectionItems<Location>(COLLECTIONS.LOCATIONS),
    getCollectionItems<Room>(COLLECTIONS.ROOMS),
    getCollectionItems<Occupant>(COLLECTIONS.OCCUPANTS),
  ]);


  return (
    <main className="min-h-screen bg-bg-white flex flex-col gap-12">
      <Hero properties={properties} />
      <AsSeenIn />
      <Homes properties={properties} locations={locations} rooms={rooms} occupants={occupants} />
      <Info />
      <MarqueeSection />
      <Neighborhoods locations={locations} properties={properties} />
      <Community />
      <ComingSoon properties={properties} locations={locations} rooms={rooms} occupants={occupants} />
    </main>
  );
}
