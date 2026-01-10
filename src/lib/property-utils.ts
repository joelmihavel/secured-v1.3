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
    lockInDiscount?: number;
}

export type LockInPeriod = 6 | 9 | 11;

export const getRoomRentBreakdown = (room: Room, lockIn: LockInPeriod = 11): RentBreakdown => {
    // Base rent is always the price for 6 months (highest price / valid base)
    const baseRent = Number(room.fieldData["room-rent"]) || null;

    // Calculate discounts based on lock-in
    let lockInDiscount = 0;
    if (lockIn === 9) lockInDiscount = 1000;
    if (lockIn === 11) lockInDiscount = 2000;

    const maintenance = room.fieldData["maintenance"] ?? null;
    const furnishing = room.fieldData["furnishing-cost"] ?? null;
    const convenience = room.fieldData["convenience-fee"] ?? null;
    const gst = room.fieldData["gst"] ?? null;

    // Total Rent = Base Rent - Discount
    const totalRent = baseRent ? baseRent - lockInDiscount : null;

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
        deposit,
        lockInDiscount
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

export const getPropertyRentBreakdown = (property: Property, lockIn: LockInPeriod = 11): RentBreakdown => {
    // Base rent is the 6-month lock-in price (highest price)
    // Fallback to whatever display rent logic if 6-month field is missing, but typically we want the base.
    const baseRent = Number(property.fieldData["6-month-lock-in"]) || getPropertyDisplayRent(property);

    // Calculate discounts based on lock-in
    let lockInDiscount = 0;
    if (lockIn === 9) lockInDiscount = 1000;
    if (lockIn === 11) lockInDiscount = 2000;

    const totalRent = baseRent - lockInDiscount;

    // Property doesn't have breakdown fields in the interface.
    return {
        baseRent: baseRent,
        maintenance: null,
        furnishing: null,
        convenience: null,
        gst: null,
        totalRent,
        deposit: null, // No field available
        lockInDiscount
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


export const sortProperties = (a: Property, b: Property): number => {
    // 1. Ranking Order (Ascending)
    const rankA = a.fieldData["ranking-order"];
    const rankB = b.fieldData["ranking-order"];

    if (rankA !== undefined && rankB !== undefined) {
        return rankA - rankB;
    }
    if (rankA !== undefined) return -1;
    if (rankB !== undefined) return 1;

    // 2. Availability Date (Earliest first)
    const dateAStr = a.fieldData["available-from"];
    const dateBStr = b.fieldData["available-from"];

    const effectiveDateA = dateAStr ? new Date(dateAStr).getTime() : (a.fieldData.available ? 0 : Infinity);
    const effectiveDateB = dateBStr ? new Date(dateBStr).getTime() : (b.fieldData.available ? 0 : Infinity);

    if (effectiveDateA !== effectiveDateB) {
        return effectiveDateA - effectiveDateB;
    }

    // 3. Properties with images
    const hasImagesA = Boolean(
        a.fieldData["property-thumbnail"]?.url ||
        a.fieldData["property-featured-photo"]?.url ||
        a.fieldData["property-photos"]?.some(p => p.url)
    );
    const hasImagesB = Boolean(
        b.fieldData["property-thumbnail"]?.url ||
        b.fieldData["property-featured-photo"]?.url ||
        b.fieldData["property-photos"]?.some(p => p.url)
    );

    if (hasImagesA !== hasImagesB) {
        return hasImagesA ? -1 : 1;
    }

    return 0;
};
