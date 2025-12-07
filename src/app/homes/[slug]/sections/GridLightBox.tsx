"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Grid, X, ChevronLeft, Copy, MessageCircle, Home, Expand } from "lucide-react";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export interface PhotoCategory {
    name: string;
    images: string[];
}

interface GridLightBoxProps {
    images: string[];
    propertyName: string;
    propertyStats?: string; // e.g., "3 BHK | 2000 Sq. Ft | 1st Floor"
    photoCategories?: PhotoCategory[]; // Optional categorized photos (e.g., by room)
    defaultTab?: string;
    previewImages?: string[]; // Optional images to show in the grid preview (defaults to first 4 of 'images')
    status?: string; // e.g., "Occupied" or "Available From Dec 3"
    isOccupied?: boolean; // Whether the room/property is occupied
}

export const GridLightBox = ({ images, propertyName, propertyStats, photoCategories, defaultTab = "all", previewImages, status, isOccupied }: GridLightBoxProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(defaultTab.toLowerCase().replace(/\s+/g, '-'));
    const [api, setApi] = useState<CarouselApi>();

    // Auto-scroll active tab into view
    React.useEffect(() => {
        if (isOpen) {
            const activeElement = document.getElementById(`tab-${activeTab}`);
            if (activeElement) {
                activeElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest',
                    inline: 'center'
                });
            }
        }
    }, [activeTab, isOpen]);

    // We'll show up to 4 images: 1 Main (Top) + 3 Sub (Bottom)
    // Use previewImages if provided, otherwise fall back to the main images array
    const imagesToShow = previewImages || images;
    const displayImages = imagesToShow.slice(0, 4);

    const sortedCategories = React.useMemo(() => photoCategories ? [...photoCategories].sort((a, b) => {
        // Ensure "Common Areas" always comes first if it exists
        if (a.name === "Common Areas") return -1;
        if (b.name === "Common Areas") return 1;
        return a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: 'base' });
    }) : [], [photoCategories]);

    // Create array of all tab values for navigation
    const allTabs = React.useMemo(() => ['all', ...sortedCategories.map(cat => cat.name.toLowerCase().replace(/\s+/g, '-'))], [sortedCategories]);

    // Sync Carousel -> Tabs
    React.useEffect(() => {
        if (!api) return;

        api.on("select", () => {
            const index = api.selectedScrollSnap();
            const newTab = allTabs[index];
            if (newTab) {
                setActiveTab(newTab);
            }
        });
    }, [api, allTabs]);

    // Scroll carousel to match activeTab when drawer opens
    React.useEffect(() => {
        if (!api || !isOpen) return;

        const index = allTabs.indexOf(activeTab);
        if (index !== -1 && index !== api.selectedScrollSnap()) {
            api.scrollTo(index, true); // true = jump without animation
        }
    }, [api, isOpen, allTabs, activeTab]);

    // Sync Tabs -> Carousel
    const handleTabChange = (value: string) => {
        setActiveTab(value);
        if (api) {
            const index = allTabs.indexOf(value);
            if (index !== -1) {
                api.scrollTo(index);
            }
        }
    };

    return (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
            <div className="w-full h-full relative group grid grid-cols-3 grid-rows-[2fr_1fr] gap-2">
                {/* Main Image (Row 1, Col Span 3) */}
                <div
                    className="relative col-span-3 bg-gray-200 overflow-hidden cursor-pointer"
                    onClick={() => setIsOpen(true)}
                >
                    {displayImages[0] ? (
                        <Image
                            src={displayImages[0]}
                            alt={`${propertyName} - Main`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            No images
                        </div>
                    )}

                    {/* Status Badge - Top Right */}
                    {status && (
                        <div className="absolute top-8 right-8 z-20">
                            <span className={cn(
                                "px-3 py-2 rounded-full text-fluid-sm font-medium border-0",
                                isOccupied
                                    ? "bg-brick-red text-brand-orange"
                                    : "bg-forest-green text-brand-yellow"
                            )}>
                                {status}
                            </span>
                        </div>
                    )}

                    {/* Show All Button - Floating on the main image */}
                    <Button
                        onClick={(e) => {
                            e.stopPropagation();
                            setIsOpen(true);
                        }}
                        variant="white"
                        size="sm"
                        leftIcon={<Expand />}
                        className="absolute bottom-4 right-4 z-20 rounded-full !text-[14px]"
                    >
                        Show all images
                    </Button>
                </div>

                {/* Sub Images (Row 2, Col Span 1 each) */}
                {[1, 2, 3].map((offset) => (
                    <div
                        key={offset}
                        className="relative col-span-1 bg-gray-100 overflow-hidden cursor-pointer"
                        onClick={() => setIsOpen(true)}
                    >
                        {displayImages[offset] && (
                            <Image
                                src={displayImages[offset]}
                                alt={`View ${offset + 1}`}
                                fill
                                className="object-cover hover:scale-105 transition-transform duration-500"
                            />
                        )}
                    </div>
                ))}

                <DrawerContent className="h-[90vh] md:h-[98vh]">
                    <DrawerTitle className="sr-only">Image Gallery</DrawerTitle>
                    {/* Custom Header */}
                    <div className="border-b border-black/10">
                        <div className="flex items-center justify-between p-6">
                            {/* Left: Back Button */}
                            <DrawerClose asChild>
                                <button className="flex items-center gap-1 md:gap-2 text-xs md:text-sm text-gray-600 hover:text-gray-900 transition-colors">
                                    <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
                                    <span className="hidden sm:inline">Back to Apartment</span>
                                    <span className="sm:hidden">Back</span>
                                </button>
                            </DrawerClose>

                            {/* Right: Action Buttons */}
                            <div className="flex items-center gap-2 md:gap-3">
                                <button className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    <Copy className="w-3 h-3 md:w-4 md:h-4" />
                                    <span className="hidden sm:inline">Copy Link</span>
                                </button>
                                <button className="flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 text-xs md:text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                                    <MessageCircle className="w-3 h-3 md:w-4 md:h-4" />
                                    <span className="hidden sm:inline">Chat with Us</span>
                                    <span className="sm:hidden">Chat</span>
                                </button>
                            </div>
                        </div>

                        {/* Property Info */}
                        <div className="px-4 md:px-6 pb-3 md:pb-4">
                            <h3 className="text-fluid-h3 font-heading font-bold mb-1 md:mb-2">{propertyName}</h3>
                            {propertyStats && (
                                <div className="flex items-center gap-1.5 md:gap-2 text-gray-600">
                                    <Home className="w-4 h-4 flex-shrink-0" />
                                    <span className="text-xs md:text-sm">{propertyStats}</span>
                                </div>
                            )}
                        </div>

                        {/* Tabs */}
                        <div className="overflow-x-auto md:overflow-visible mx-2 md:mx-4 scroll-smooth scrollbar-hide">
                            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full" variant="bar">
                                <TabsList className="w-full md:w-auto justify-start px-4 md:px-6 lg:px-0 gap-4 md:gap-6 flex-nowrap md:flex-wrap min-w-max md:min-w-0">
                                    <TabsTrigger
                                        id="tab-all"
                                        value="all"
                                        className="px-0 pb-2 md:pb-3 flex-shrink-0"
                                    >
                                        All Photos
                                    </TabsTrigger>
                                    {sortedCategories.map((category, idx) => (
                                        <TabsTrigger
                                            key={idx}
                                            id={`tab-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                                            value={category.name.toLowerCase().replace(/\s+/g, '-')}
                                            className="px-0 pb-2 md:pb-3 flex-shrink-0"
                                        >
                                            {category.name}
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>

                    {/* Carousel Content */}
                    <Carousel setApi={setApi} className="w-full h-full">
                        <CarouselContent className="-ml-0">
                            {/* All Photos Slide */}
                            <CarouselItem className="pl-0">
                                <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-240px)] md:max-h-[calc(98vh-280px)]">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                        {images.map((img, idx) => (
                                            <div
                                                key={idx}
                                                className="relative aspect-[4/3] group/item overflow-hidden rounded-lg bg-gray-100 hover:shadow-lg transition-shadow"
                                            >
                                                <Image
                                                    src={img}
                                                    alt={`${propertyName} - ${idx + 1}`}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                                                    loading="lazy"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Notice Banner */}
                                    <div className="mt-4 md:mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 flex items-start gap-2 md:gap-3">
                                        <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <span className="text-blue-500 text-[10px] md:text-xs font-bold">i</span>
                                        </div>
                                        <p className="text-xs md:text-sm text-gray-700">
                                            No surprises — the property looks just like it does in these photos.
                                        </p>
                                    </div>
                                </div>
                            </CarouselItem>

                            {/* Category Slides */}
                            {sortedCategories.map((category, idx) => (
                                <CarouselItem key={idx} className="pl-0">
                                    <div className="p-4 md:p-6 overflow-y-auto max-h-[calc(90vh-240px)] md:max-h-[calc(98vh-280px)]">
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                                            {category.images.map((img, imgIdx) => (
                                                <div
                                                    key={imgIdx}
                                                    className="relative aspect-[4/3] group/item overflow-hidden rounded-lg bg-gray-100 hover:shadow-lg transition-shadow"
                                                >
                                                    <Image
                                                        src={img}
                                                        alt={`${category.name} - ${imgIdx + 1}`}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover/item:scale-105"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            ))}
                                        </div>

                                        {/* Notice Banner */}
                                        <div className="mt-4 md:mt-6 bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 flex items-start gap-2 md:gap-3">
                                            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full border-2 border-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <span className="text-blue-500 text-[10px] md:text-xs font-bold">i</span>
                                            </div>
                                            <p className="text-xs md:text-sm text-gray-700">
                                                No surprises — the property looks just like it does in these photos.
                                            </p>
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                    </Carousel>
                </DrawerContent>
            </div>
        </Drawer>
    );
};
