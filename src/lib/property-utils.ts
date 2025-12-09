import { Property, Room } from "@/lib/webflow";

export interface PhotoCategory {
    name: string;
    images: string[];
}

export const getPropertyImagesData = (property: Property, rooms: Room[]) => {
    // Get all property photos
    const photos = property.fieldData["property-photos"] || [];
    const thumbnailUrl = property.fieldData["property-thumbnail"]?.url;
    const featuredUrl = property.fieldData["property-featured-photo"]?.url;

    // Build image array (Common Areas + Rooms)
    const allImages = [
        thumbnailUrl,
        featuredUrl,
        ...photos.map(p => p.url),
        ...rooms.flatMap(room => {
            const gallery = room.fieldData["image-gallery"] || [];
            const featureImage = room.fieldData["feature-image"];
            return featureImage ? [featureImage, ...gallery] : gallery;
        }).map(img => img.url)
    ].filter(Boolean) as string[];

    // Build photo categories from rooms
    const roomCategories = rooms.map(room => {
        const gallery = room.fieldData["image-gallery"] || [];
        const featureImage = room.fieldData["feature-image"];
        const roomImages = featureImage ? [featureImage, ...gallery] : gallery;

        return {
            name: room.fieldData["room-name"] || room.fieldData.name || "Room",
            images: roomImages.map(img => img.url)
        };
    }).filter(category => category.images.length > 0);

    // Create Common Areas category from property photos
    const commonAreaImages = [
        thumbnailUrl,
        featuredUrl,
        ...photos.map(p => p.url)
    ].filter(Boolean) as string[];

    const commonAreasCategory = {
        name: "Common Areas",
        images: commonAreaImages
    };

    // Combine categories: Common Areas first, then Rooms
    const photoCategories = [
        ...(commonAreaImages.length > 0 ? [commonAreasCategory] : []),
        ...roomCategories
    ];

    return {
        allImages,
        photoCategories,
        commonAreaImages
    };
};

export const ADD_ONS = [
    { name: "Maid", price: 1000, unit: "/mo" },
    { name: "Electricity", price: 800, unit: "/mo" },
    { name: "Water", price: 300, unit: "/mo" },
    { name: "Wifi", price: 300, unit: "/mo" },
    { name: "Cook", price: 2000, unit: "/mo" },
    { name: "Car Parking", price: 500, unit: "/mo" },
    { name: "Key", price: 1500, unit: "/key" },
    { name: "Move-In", price: 2000, unit: "" },
    { name: "BGV", price: 600, unit: "" },
];

export interface RentBreakdown {
    baseRent: number | null;
    maintenance: number | null;
    furnishing: number | null;
    convenience: number | null;
    gst: number | null;
    totalRent: number | null;
    deposit: number | null;
}

export type LockInPeriod = 6 | 9 | 11;

export const getRoomRentBreakdown = (room: Room, lockIn: LockInPeriod = 11): RentBreakdown => {
    const baseRent = room.fieldData["base-rent"] ?? null;
    const maintenance = room.fieldData["maintenance"] ?? null;
    const furnishing = room.fieldData["furnishing-cost"] ?? null;
    const convenience = room.fieldData["convenience-fee"] ?? null;
    const gst = room.fieldData["gst"] ?? null;

    // Get rent based on lock-in period
    // CMS field mapping (counterintuitive naming):
    // - room-rent = 6 month price (highest - most flexibility)
    // - 3-month-cost-2 = 9 month price (middle)
    // - 6-month-cost-2 = 11 month price (lowest - longest commitment)
    let totalRent: number | null = null;
    if (lockIn === 6) {
        totalRent = Number(room.fieldData["room-rent"]) || null;
    } else if (lockIn === 9) {
        totalRent = Number(room.fieldData["3-month-cost-2"]) || Number(room.fieldData["room-rent"]) || null;
    } else {
        totalRent = Number(room.fieldData["6-month-cost-2"]) || Number(room.fieldData["room-rent"]) || null;
    }

    // Get deposit based on lock-in period
    let deposit: number | null = null;
    if (lockIn === 6) {
        deposit = room.fieldData["security-deposit"] ?? null;
    } else if (lockIn === 9) {
        deposit = room.fieldData["9-month-security-deposit"] ?? null;
    } else {
        deposit = room.fieldData["11-month-security-deposit"] ?? null;
    }

    return {
        baseRent,
        maintenance,
        furnishing,
        convenience,
        gst,
        totalRent,
        deposit
    };
};

export const getPropertyDisplayRent = (property: Property): number => {
    if (property.fieldData["6-month-lock-in"]) {
        return Number(property.fieldData["6-month-lock-in"]);
    } else if (property.fieldData["no-lock-in"]) {
        return Number(property.fieldData["no-lock-in"]);
    } else {
        return Number(property.fieldData["rent-in-rupees"] || 0);
    }
};

export const getPropertyRentBreakdown = (property: Property): RentBreakdown => {
    // Determine the full house rent based on available lock-in fields
    const totalRent = getPropertyDisplayRent(property);

    // Property doesn't have breakdown fields in the interface.
    return {
        baseRent: totalRent, // Assuming total rent is the base for full house if no breakdown
        maintenance: null,
        furnishing: null,
        convenience: null,
        gst: null,
        totalRent,
        deposit: null // No field available
    };
};

export const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || isNaN(amount)) {
        return "Not found";
    }
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(amount);
};

