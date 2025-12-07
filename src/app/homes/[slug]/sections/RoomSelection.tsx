"use client";

import React, { useState } from "react";
import { Property, Room, Occupant, getWebflowOptionLabel } from "@/lib/webflow";
import { OpenSection } from "@/components/layout/OpenSection";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { GridLightBox } from "./GridLightBox";
import { PhotoCategory } from "@/lib/property-utils";
import { User, Cigarette, CigaretteOff, Utensils, Leaf, Bed, Car, Layers, Bath, Wind, Laptop, Info } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { RentCalculatorDrawer } from "@/components/homes/RentCalculatorDrawer";
import { getRoomRentBreakdown, getPropertyRentBreakdown, RentBreakdown, getPropertyDisplayRent } from "@/lib/property-utils";
import { motion } from "framer-motion";
import { RoomNotificationModal } from "@/components/ui/RoomNotificationModal";

interface RoomSelectionProps {
    property: Property;
    rooms: Room[];
    occupants: Occupant[];
    allImages: string[];
    photoCategories: PhotoCategory[];
}

interface RoomDisplayData {
    id: string;
    name: string;
    price: string;
    type: string;
    lockIn: string;
    sqFt: number;
    amenities: string[];
    status: string;
    isOccupied: boolean;
    occupant: {
        name: string;
        profession?: string;
        company?: string;
        image?: string;
        gender?: string;
        smokes?: boolean;
        foodPreference?: string;
    } | null;
    images: string[];
    raw: Room;
}

export const RoomSelection = ({ property, rooms, occupants, allImages, photoCategories }: RoomSelectionProps) => {
    const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
    const [calculatorData, setCalculatorData] = useState<{
        title: string;
        image: string;
        lockInPeriod: string;
        breakdown: RentBreakdown;
    } | null>(null);
    const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);
    const [notificationModalData, setNotificationModalData] = useState<{
        propertyId: string;
        roomId: string; 
        roomName: string;
        propertyName: string;
    } | null>(null);

    const handleRoomPricingClick = (room: RoomDisplayData) => {
        const breakdown = getRoomRentBreakdown(room.raw);
        setCalculatorData({
            title: room.name,
            image: room.images[0],
            lockInPeriod: room.lockIn,
            breakdown
        });
        setIsCalculatorOpen(true);
    };

    const handleFullHousePricingClick = () => {
        const breakdown = getPropertyRentBreakdown(property);
        setCalculatorData({
            title: "Full House",
            image: property.fieldData["property-thumbnail"]?.url || "",
            lockInPeriod: property.fieldData["6-month-lock-in"] ? "6 months" : "11 months",
            breakdown
        });
        setIsCalculatorOpen(true);
    };

    if (rooms.length === 0) {
        return null;
    }

    // Amenity icon mapping
    const getAmenityIcon = (amenity: string) => {
        const iconMap: Record<string, React.ReactNode> = {
            "Attached Bathroom": <Bath className="w-[18px] h-[18px]" />,
            "Balcony": <Wind className="w-[18px] h-[18px]" />,
            "Dedicated Workspace": <Laptop className="w-[18px] h-[18px]" />,
            "Queen Sized Bed": <Bed className="w-[18px] h-[18px]" />,
        };
        return iconMap[amenity] || <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6 9 17l-5-5" /></svg>;
    };

    // Transform Room data for display
    const roomData = [...rooms]
        .sort((a, b) => {
            const nameA = a.fieldData["room-name"] || a.fieldData.name || "";
            const nameB = b.fieldData["room-name"] || b.fieldData.name || "";
            return nameA.localeCompare(nameB, undefined, { numeric: true, sensitivity: 'base' });
        })
        .map((room) => {
            const gallery = room.fieldData["image-gallery"] || [];
            const featureImage = room.fieldData["feature-image"];
            const allImages = featureImage ? [featureImage, ...gallery] : gallery;

            // Find occupant for this room using room.fieldData.occupant reference (consistent with PropertyCard)
            const occupant = room.fieldData.occupant
                ? occupants.find(occ => occ.id === room.fieldData.occupant)
                : null;

            // Calculate amenities list from room data
            const amenities = [];
            if (room.fieldData.bathroom) amenities.push("Attached Bathroom");
            if (room.fieldData.balcony) amenities.push("Balcony");
            if (room.fieldData["dedicated-workspace"]) amenities.push("Dedicated Workspace");
            amenities.push("Queen Sized Bed"); // Default

            return {
                id: room.id,
                name: room.fieldData["room-name"] || room.fieldData.name,
                price: room.fieldData["room-rent"] || "0",
                type: "Private Room",
                lockIn: "11 months",
                sqFt: room.fieldData["area-sq-ft"] || 180,
                amenities,
                status: room.fieldData.available
                    ? (room.fieldData["available-from"]
                        ? `Available From ${new Date(room.fieldData["available-from"]).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`
                        : "Available Now")
                    : "Occupied",
                isOccupied: !room.fieldData.available,
                occupant: occupant ? {
                    name: occupant.fieldData.name,
                    profession: occupant.fieldData.profession,
                    company: occupant.fieldData.company,
                    image: occupant.fieldData["profile-picture"]?.url,
                    gender: occupant.fieldData.gender,
                    smokes: occupant.fieldData.smokes,
                    foodPreference: occupant.fieldData["food-preference"]
                } : null,
                images: allImages.map(img => img.url),
                raw: room
            };
        });

    return (
        <OpenSection id="rooms" className="py-16 px-4 md:py-32 md:px-24">
            <div className="text-center mb-8 md:mb-12">
                <h2 className="text-fluid-h2 text-text-main mb-4 md:mb-6">
                    Take a room or the entire house<span className="font-zin font-light"> <br /> Your call</span>
                </h2>

                <Tabs defaultValue="shared" className="w-full" variant="pill">
                    <div className="flex justify-center mb-8 md:mb-12">
                        <TabsList>
                            <TabsTrigger value="shared">
                                Shared Living
                            </TabsTrigger>
                            <TabsTrigger value="full">
                                Full House
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="shared" className="space-y-8 md:space-y-12 mt-0">
                        <motion.div
                            initial={{ y: 0 }}
                            animate={{ y: 20 }}

                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="space-y-16 md:space-y-24"
                        >
                            {roomData.map((room) => (
                                <div key={room.id} className="rounded-3xl flex flex-col lg:flex-row gap-6 md:gap-8">
                                    {/* Left: Image Gallery */}
                                    <div className="w-full lg:w-3/5 rounded-2xl overflow-hidden shadow-sm aspect-[4/3] lg:aspect-auto lg:h-auto min-h-[300px] lg:min-h-0">
                                        <GridLightBox
                                            images={allImages}
                                            previewImages={room.images}
                                            propertyName={property.fieldData.name}
                                            photoCategories={photoCategories}
                                            defaultTab={room.name}
                                            status={room.status}
                                            isOccupied={room.isOccupied}
                                        />
                                    </div>

                                    {/* Right: Details */}
                                    <div className="w-full lg:w-2/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between bg-ground-brown/10 text-text-main">
                                        <div>
                                            {room.isOccupied ? (
                                                <div className="text-center mb-6 md:mb-8 px-4 py-12 md:py-16 bg-ground-brown/12 rounded-2xl relative">
                                                    <p className="text-sm font-medium text-text-main/70 mb-2">{room.name}</p>
                                                    <h3 className="text-fluid-h3 font-heading text-text-main mb-4 font-zin">
                                                        {room.occupant?.profession || "Occupied by Someone"}
                                                    </h3>
                                                    {room.occupant?.company && (
                                                        <p className="text-sm text-text-main mb-6">
                                                            Works at {room.occupant.company}
                                                        </p>
                                                    )}

                                                    {/* Occupant Tags */}
                                                    <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
                                                        {room.occupant?.gender && getWebflowOptionLabel(room.occupant.gender) && (
                                                            <span className="bg-pastel-violet/50 px-3 py-1 rounded-full text-sm font-medium text-text-main border border-text-main/10 flex items-center gap-1">
                                                                <User className="w-3 h-3" />
                                                                {getWebflowOptionLabel(room.occupant.gender)}
                                                            </span>
                                                        )}
                                                        {room.occupant?.smokes !== undefined && (
                                                            <span className={cn(
                                                                "px-3 py-1 rounded-full text-sm font-medium text-text-main border border-text-main/10 flex items-center gap-1",
                                                                room.occupant.smokes ? "bg-pastel-red/50" : "bg-pastel-green/50"
                                                            )}>
                                                                {room.occupant.smokes ? <Cigarette className="w-3 h-3" /> : <CigaretteOff className="w-3 h-3" />}
                                                                {room.occupant.smokes ? "Smokes" : "Non-Smoker"}
                                                            </span>
                                                        )}
                                                        {room.occupant?.foodPreference && (
                                                            <span className={cn(
                                                                "px-3 py-1 rounded-full text-sm font-medium text-text-main border border-text-main/10 flex items-center gap-1",
                                                                getWebflowOptionLabel(room.occupant.foodPreference)?.toLowerCase().includes("non") ? "bg-pastel-red/50" : "bg-pastel-green/50"
                                                            )}>
                                                                {getWebflowOptionLabel(room.occupant.foodPreference)?.toLowerCase().includes("non") ? <Utensils className="w-3 h-3" /> : <Leaf className="w-3 h-3" />}
                                                                {getWebflowOptionLabel(room.occupant.foodPreference)}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-center mb-6 md:mb-8 bg-ground-brown/12 rounded-2xl px-4 py-12 md:py-16 relative">
                                                    <p className="text-sm font-medium text-text-main/70 mb-2">{room.name}</p>
                                                    <div className="flex items-baseline justify-center gap-1 mb-2">
                                                        <span className="font-heading text-fluid-h3 text-text-main font-zin">₹{Number(room.price).toLocaleString('en-IN')}</span>
                                                        <span className="text-sm text-text-main/70">/ mo</span>
                                                    </div>
                                                    <div className="flex items-center justify-center gap-1 text-xs text-text-main/60">
                                                        <span className="flex items-center gap-1">
                                                            Lock in Period: {room.lockIn}
                                                            <div className="relative group inline-block">
                                                                <Info className="w-3 h-3 cursor-help" />
                                                                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
                                                                    Minimum commitment period for your stay
                                                                    <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black"></div>
                                                                </div>
                                                            </div>
                                                        </span>
                                                    </div>

                                                    {/* See Pricing Button */}
                                                    <div className="mt-6">
                                                        <Button
                                                            variant="outline"
                                                            className="bg-ground-brown/12 border-text-main text-text-main hover:bg-text-main/5 rounded-lg py-2 px-6 text-sm h-auto"
                                                            onClick={() => handleRoomPricingClick(room)}
                                                        >
                                                            Understand Your Rent
                                                        </Button>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="space-y-4 mb-8">
                                                <div className="flex items-center gap-3 text-sm text-text-main">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" /><path d="M7 3.34V5a3 3 0 0 0 3 3v0a2 2 0 0 1 2 2v0c0 1.1.9 2 2 2v0a2 2 0 0 0 2-2v0c0-1.1.9-2 2-2h3.17" /><path d="M11 21.95V18a2 2 0 0 0-2-2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" /></svg>
                                                    {room.sqFt} Sq. ft.
                                                </div>
                                                {room.amenities.map((amenity, i) => (
                                                    <div key={i} className="flex items-center gap-3 text-sm text-text-main">
                                                        {getAmenityIcon(amenity)}
                                                        {amenity}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            {room.isOccupied ? (
                                                <>
                                                    <Button disabled size="md" variant="ghost" className="w-full cursor-not-allowed bg-ground-brown/10 text-text-main/60">
                                                        Occupied
                                                    </Button>
                                                    <Button 
                                                        size="md" 
                                                        variant="ghost" 
                                                        className="w-full bg-white border-text-main text-text-main"
                                                        onClick={() => {
                                                            setNotificationModalData({
                                                                propertyId: property.id,
                                                                roomId: room.id,
                                                                roomName: room.name,
                                                                propertyName: property.fieldData.name,
                                                            });
                                                            setIsNotificationModalOpen(true);
                                                        }}
                                                    >
                                                        Get notified
                                                    </Button>
                                                </>
                                            ) : (
                                                <>
                                                    <Button size="md" className="w-full">
                                                        Book a Tour
                                                    </Button>
                                                    <Button size="md" variant="ghost" className="w-full bg-white">
                                                        Talk to us
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    </TabsContent>

                    <TabsContent value="full" className="mt-0">
                        <motion.div
                            initial={{ y: 0 }}
                            animate={{ y: 20 }}

                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        >
                            <div className="rounded-3xl flex flex-col lg:flex-row gap-6 md:gap-8">
                                {/* Left: Image Gallery */}
                                <div className="w-full lg:w-3/5 rounded-2xl overflow-hidden shadow-sm aspect-[4/3] lg:aspect-auto lg:h-auto min-h-[300px] lg:min-h-0">
                                    <GridLightBox
                                        images={allImages}
                                        propertyName={property.fieldData.name}
                                        photoCategories={photoCategories}
                                        defaultTab="all"
                                        status={property.fieldData["full-house-available"] ? "Available" : "Occupied"}
                                        isOccupied={!property.fieldData["full-house-available"]}
                                    />
                                </div>

                                {/* Right: Details */}
                                <div className="w-full lg:w-2/5 rounded-3xl p-6 md:p-8 flex flex-col justify-between bg-ground-brown/10 text-text-main">
                                    <div>
                                        {property.fieldData["full-house-available"] ? (
                                            <div className="text-center mb-6 md:mb-8 px-4 py-12 md:py-16 bg-ground-brown/12 rounded-2xl relative">
                                                <p className="text-sm font-medium text-text-main/70 mb-2">Full House</p>
                                                <div className="flex items-baseline justify-center gap-1 mb-2">
                                                    <span className="text-fluid-h3 font-heading text-text-main">₹{getPropertyDisplayRent(property).toLocaleString('en-IN')}</span>
                                                    <span className="text-sm text-text-main/70">/ mo</span>
                                                </div>
                                                <div className="flex items-center justify-center gap-1 text-xs text-text-main/60">
                                                    <span className="flex items-center gap-1">
                                                        Lock in Period: {property.fieldData["6-month-lock-in"] ? "6 months" : "11 months"}
                                                        <div className="relative group inline-block">
                                                            <Info className="w-3 h-3 cursor-help" />
                                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-black text-white text-xs rounded-lg whitespace-nowrap opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none z-50">
                                                                Minimum commitment period for your stay
                                                                <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-black"></div>
                                                            </div>
                                                        </div>
                                                    </span>
                                                </div>

                                                <div className="mt-6">
                                                    <Button
                                                        variant="outline"
                                                        className="bg-transparent border-text-main text-text-main hover:bg-text-main/5 rounded-lg py-2 px-6 text-sm h-auto"
                                                        onClick={handleFullHousePricingClick}
                                                    >
                                                        See Pricing
                                                    </Button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="text-center mb-6 md:mb-8 px-4 py-12 md:py-16 bg-ground-brown/12 rounded-2xl relative">
                                                <p className="text-sm font-medium text-text-main/70 mb-2">Full House</p>
                                                <h3 className="text-fluid-h3 font-heading text-text-main mb-2">
                                                    Occupied by Someone
                                                </h3>
                                                <p className="text-sm text-text-main mb-6 max-w-xs mx-auto">
                                                    {roomData.some(r => !r.isOccupied)
                                                        ? "Full House is unavailable. You can go with shared living or get notified when the house is available."
                                                        : "This property is currently fully booked."}
                                                </p>
                                            </div>
                                        )}

                                        <div className="space-y-4 mb-8">
                                            {property.fieldData["property-bedrooms"] && (
                                                <div className="flex items-center gap-3 text-sm text-text-main">
                                                    <Bed className="w-[18px] h-[18px]" />
                                                    {property.fieldData["property-bedrooms"]} BHK
                                                </div>
                                            )}
                                            {property.fieldData["carpet-area"] && (
                                                <div className="flex items-center gap-3 text-sm text-text-main">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.54 15H17a2 2 0 0 0-2 2v4.54" /><path d="M7 3.34V5a3 3 0 0 0 3 3v0a2 2 0 0 1 2 2v0c0 1.1.9 2 2 2v0a2 2 0 0 0 2-2v0c0-1.1.9-2 2-2h3.17" /><path d="M11 21.95V18a2 2 0 0 0-2-2v0a2 2 0 0 1-2-2v-1a2 2 0 0 0-2-2H2.05" /></svg>
                                                    {property.fieldData["carpet-area"]} Sq. Ft
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 text-sm text-text-main">
                                                <Car className="w-[18px] h-[18px]" />
                                                {property.fieldData["car-parking"] ? "Parking" : "No Parking"}
                                            </div>
                                            {property.fieldData["floor-number-new"] && (
                                                <div className="flex items-center gap-3 text-sm text-text-main">
                                                    <Layers className="w-[18px] h-[18px]" />
                                                    {property.fieldData["floor-number-new"]} Floor
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        {property.fieldData["full-house-available"] ? (
                                            <>
                                                <Button size="md" className="w-full">
                                                    Book a Tour
                                                </Button>
                                                <Button size="md" variant="ghost" className="w-full bg-white">
                                                    Talk to us
                                                </Button>
                                            </>
                                        ) : (
                                            <>
                                                <Button disabled size="md" variant="ghost" className="w-full cursor-not-allowed bg-ground-brown/10 text-text-main/60">
                                                    Occupied
                                                </Button>
                                                <Button 
                                                    size="md" 
                                                    variant="ghost" 
                                                    className="w-full bg-white border-text-main text-text-main"
                                                    onClick={() => {
                                                        setNotificationModalData({
                                                            propertyId: property.id,
                                                            roomId: "full_house",
                                                            roomName: "Full House",
                                                            propertyName: property.fieldData.name,
                                                        });
                                                        setIsNotificationModalOpen(true);
                                                    }}
                                                >
                                                    Get notified
                                                </Button>
                                            </>

                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </TabsContent>
                </Tabs>
            </div>


            {calculatorData && (
                <RentCalculatorDrawer
                    isOpen={isCalculatorOpen}
                    onClose={() => setIsCalculatorOpen(false)}
                    title={calculatorData.title}
                    image={calculatorData.image}
                    lockInPeriod={calculatorData.lockInPeriod}
                    breakdown={calculatorData.breakdown}
                />
            )}

            {notificationModalData && (
                <RoomNotificationModal
                    isOpen={isNotificationModalOpen}
                    onClose={() => setIsNotificationModalOpen(false)}
                    propertyId={notificationModalData.propertyId}
                    roomId={notificationModalData.roomId}
                    roomName={notificationModalData.roomName}
                    propertyName={notificationModalData.propertyName}
                />
            )}
        </OpenSection>
    );
};
