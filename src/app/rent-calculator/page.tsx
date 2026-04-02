import {
  COLLECTIONS,
  getCollectionItems,
  type Location,
  type Occupant,
  type Property,
  type Room,
} from "@/lib/webflow";
import { RentCalculatorClient } from "./RentCalculatorClient";

export default async function RentCalculatorPage() {
  const [properties, locations, rooms, occupants] = await Promise.all([
    getCollectionItems<Property>(COLLECTIONS.PROPERTIES),
    getCollectionItems<Location>(COLLECTIONS.LOCATIONS),
    getCollectionItems<Room>(COLLECTIONS.ROOMS),
    getCollectionItems<Occupant>(COLLECTIONS.OCCUPANTS),
  ]);

  return (
    <RentCalculatorClient
      properties={properties}
      locations={locations}
      rooms={rooms}
      occupants={occupants}
    />
  );
}
