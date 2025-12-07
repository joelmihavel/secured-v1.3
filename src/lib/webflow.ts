
export const WEBFLOW_API_TOKEN = process.env.NEXT_PUBLIC_WEBFLOW_API_TOKEN!;
export const SITE_ID = "6593ed11d5ad65d107dfe76c";

export const COLLECTIONS = {
    PROPERTIES: "6593ed11d5ad65d107dfe7af",
    LOCATIONS: "6595a74ba4f6dc705a68fc96",
    REVIEWS: "6595b72233057094bab0e0c1",
    AMENITIES: "6595a6b3510135f8bf9c4000",
    ROOMS: "6595bb2d446200b72e034d85",
    OCCUPANTS: "6595b92f9526255b091e9f83",
};

// Mapping for Webflow Option IDs to human-readable labels
export const WEBFLOW_OPTION_MAP: Record<string, string> = {
    // Gender
    "8edcf104a279f1328664aa636a7c4a16": "Male",
    "1111d9d30ab26526a3d8f487f60f4524": "Female",

    // Food Preference
    "a90e206b628bdff99bc3f0d5e10b4ca5": "Non-Vegetarian",
    "429e0261dda90fba9da3135f0ce5e9a7": "Vegetarian",
    "6595b92f9526255b091e9f85": "Eggetarian", // Example ID
};

export const getWebflowOptionLabel = (id: string | undefined): string | undefined => {
    if (!id) return undefined;
    return WEBFLOW_OPTION_MAP[id] || id;
};

export interface WebflowItem {
    id: string;
    cmsLocaleId: string;
    lastPublished: string;
    lastUpdated: string;
    createdOn: string;
    isArchived: boolean;
    isDraft: boolean;
    fieldData: Record<string, unknown>;
}

export interface Property extends WebflowItem {
    fieldData: {
        name: string;
        slug: string;
        "property-thumbnail"?: { url: string; alt?: string };
        "property-photos"?: { url: string; alt?: string }[];
        "property-video"?: { url: string; metadata?: Record<string, unknown> };
        "property-featured-photo"?: { url: string; alt?: string };
        "property-long-description"?: string;
        "property-description"?: string;
        "rent-in-rupees"?: string;
        "property-bedrooms"?: number;
        "property-bathrooms"?: number;
        "carpet-area"?: number;
        "property-is-featured"?: boolean;
        type?: string; // Option ID
        amenities?: string[]; // MultiReference IDs
        rooms?: string[]; // MultiReference IDs
        location?: string; // Reference ID
        hotspots?: string[]; // MultiReference IDs
        reviews?: string[]; // MultiReference IDs
        available?: boolean;
        "available-from"?: string;
        "car-parking"?: boolean;
        "all-inventory"?: string; // Link
        "schedule-link"?: string; // Link
        "female-only"?: boolean;
        "6-month-lock-in"?: string;
        "3-month-lock-in"?: string;
        "no-lock-in"?: string;
        "full-house-available"?: boolean;
        "floor-number-new"?: string;
        "ranking-order"?: number;
        "map-latitude"?: string;
        "map-longitude"?: string;
        "house-tour"?: { url: string; metadata?: Record<string, unknown> };
    };
}

export interface Location extends WebflowItem {
    fieldData: {
        name: string;
        slug: string;
        city?: string; // Option ID
        properties?: string[]; // MultiReference IDs
        "unlisted-house"?: string[]; // MultiReference IDs
    };
}

export interface Review extends WebflowItem {
    fieldData: {
        name: string;
        slug: string;
        message?: string;
        profession?: string;
        "profile-picture"?: { url: string; alt?: string };
        property?: string; // Reference ID
    };
}

export interface Amenity extends WebflowItem {
    fieldData: {
        name: string;
        slug: string;
        icon?: { url: string; alt?: string };
    };
}

export interface Room extends WebflowItem {
    fieldData: {
        name: string;
        slug: string;
        "room-name"?: string;
        "room-rent"?: string;
        "base-rent"?: number;
        "maintenance"?: number;
        "furnishing-cost"?: number;
        "convenience-fee"?: number;
        "gst"?: number;
        "3-month-cost-2"?: string;
        "6-month-cost-2"?: string;
        "area-sq-ft"?: number;
        "feature-image"?: { url: string; alt?: string };
        "image-gallery"?: { url: string; alt?: string }[];
        "balcony"?: boolean;
        "dedicated-workspace"?: boolean;
        "available"?: boolean;
        "available-from"?: string;
        "bathroom"?: string; // Option ID
        "bed-tyoe"?: string; // Option ID (typo in Webflow)
        property?: string; // Reference ID to Property
        occupant?: string; // Reference ID to Occupant
    };
}

export interface Occupant extends WebflowItem {
    fieldData: {
        name: string;
        slug: string;
        profession?: string;
        company?: string;
        "profile-picture"?: { url: string; alt?: string };
        gender?: string; // Option ID
        "food-preference"?: string; // Option ID
        smokes?: boolean;
        room?: string; // Reference ID
        property?: string; // Reference ID
    };
}

export async function getCollectionItems<T extends WebflowItem>(collectionId: string): Promise<T[]> {
    let allItems: T[] = [];
    let offset = 0;
    const limit = 100; // Webflow API limit
    let total = 0;

    try {
        do {
            const url = `https://api.webflow.com/v2/collections/${collectionId}/items?limit=${limit}&offset=${offset}`;
            const options = {
                method: "GET",
                headers: {
                    accept: "application/json",
                    authorization: `Bearer ${WEBFLOW_API_TOKEN}`,
                },
                next: { revalidate: 3600 },
            };

            const response = await fetch(url, options);
            if (!response.ok) {
                throw new Error(`Error fetching collection items: ${response.statusText}`);
            }
            const data = await response.json();

            if (data.items) {
                allItems = allItems.concat(data.items as T[]);
            }

            total = data.pagination?.total || 0;
            offset += limit;

        } while (offset < total);

        return allItems;
    } catch (error) {
        console.error("Failed to fetch Webflow items:", error);
        return [];
    }
}
