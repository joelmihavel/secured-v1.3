import { AVAILABLE_NOW_LABEL, OCCUPIED_LABEL } from "@/constants";
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
        return AVAILABLE_NOW_LABEL;
    } else {
        return OCCUPIED_LABEL;
    }
}

export const getAvailabilityDateForProperty = (rooms: Room[]): string => {
    const roomsAvailable: string[] = []
    rooms.forEach((room) => {
        roomsAvailable.push(getAvailabilityDate(room))
    })

    const uniqueRoomsAvailable = [...new Set(roomsAvailable)]

   
    if(uniqueRoomsAvailable.length === 1){
        return uniqueRoomsAvailable[0]
    }

    if(uniqueRoomsAvailable.length === 2){
        if(uniqueRoomsAvailable.includes(AVAILABLE_NOW_LABEL)){
            return AVAILABLE_NOW_LABEL
        }
        const filterAvailaleFromRoom = uniqueRoomsAvailable.filter((room) => room !== OCCUPIED_LABEL)
        if(filterAvailaleFromRoom.length === 1){
            return filterAvailaleFromRoom[0]
        }
    }

    return uniqueRoomsAvailable.join(", ")
}