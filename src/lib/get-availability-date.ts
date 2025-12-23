import { Property, Room } from "./webflow"


export const getAvailabilityDate = (room: Room): string => {
    const available = room.fieldData.available
    const availableFrom = room.fieldData["available-from"]
    if (available) {
        if (availableFrom) {
            const availDate = new Date(availableFrom);
            const now = new Date();

            if (!isNaN(availDate.getTime()) && availDate > now) {
                const day = availDate.getDate();
                const month = availDate.toLocaleString('default', { month: 'short' });
                return `Available from ${month} ${day}`;
            }
        }
        return 'Available Now';
    } else {
        return "Occupied";
    }
}
