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
  const properties = await getCollectionItems<Property>(COLLECTIONS.PROPERTIES);
  const locations = await getCollectionItems<Location>(COLLECTIONS.LOCATIONS);
  const rooms = await getCollectionItems<Room>(COLLECTIONS.ROOMS);
  const occupants = await getCollectionItems<Occupant>(COLLECTIONS.OCCUPANTS);


  return (
    <main className="min-h-screen bg-bg-white">
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
