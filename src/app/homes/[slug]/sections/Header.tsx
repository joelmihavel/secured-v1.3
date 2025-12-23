"use client";

import React, { useEffect, useState } from "react";
import {
  Property,
  Amenity,
  WEBFLOW_BACKGROUND_COLOUR_MAP,
  Room,
} from "@/lib/webflow";
import { OpenSection } from "@/components/layout/OpenSection";
import { FastAverageColor } from "fast-average-color";
import { findClosestColor, DARK_SHADES } from "@/lib/colors";
import { PhotoCategory } from "@/lib/property-utils";
import {
  IconMapPin as MapPin,
  IconCalendar as Calendar,
  IconBed as Bed,
  IconPlayerPlayFilled as PlayIcon,
  IconDoor as DoorIcon,
} from "@tabler/icons-react";
import { GridLightBox } from "./GridLightBox";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { getAvailabilityDateForProperty, getAvailabilityDate } from "@/lib/get-availability-date";
import { AVAILABLE_NOW_LABEL } from "@/constants";

interface HeaderProps {
  rooms: Room[];
  property: Property;
  amenities: Amenity[];
  allImages: string[];
  photoCategories: PhotoCategory[];
  locationName?: string;
}

const TEXT_COLOR = {
  "bg-brand-yellow": "text-black",
  "bg-brand-cyan": "text-black",
  "bg-brand-pink": "text-black",
  "bg-brand-orange": "text-black",
};

const BG_COLOR_MAP: Record<string, string> = {
  "forest-green": "bg-forest-green",
  "ground-brown": "bg-ground-brown",
  "brick-red": "bg-brick-red",
  "night-violet": "bg-night-violet",
};

export const Header = ({
  rooms,
  property,
  allImages,
  photoCategories,
  locationName,
}: HeaderProps) => {
  const [bgColorName, setBgColorName] = useState<string>("ground-brown");

  const videoUrl =
    property.fieldData["property-video"]?.url ||
    property.fieldData["house-tour"]?.url;

  // Transform various YouTube URL formats to embed format
  let embedUrl: string | undefined;
  if (videoUrl) {
    if (videoUrl.includes("youtu.be/")) {
      // Handle https://youtu.be/VIDEO_ID format
      embedUrl = videoUrl.replace("youtu.be/", "youtube.com/embed/");
    } else if (videoUrl.includes("watch?v=")) {
      // Handle youtube.com/watch?v=VIDEO_ID format
      embedUrl = videoUrl.replace("watch?v=", "embed/");
    } else if (videoUrl.includes("/embed/")) {
      // Already in embed format
      embedUrl = videoUrl;
    } else {
      // Fallback: use as-is
      embedUrl = videoUrl;
    }
    console.log("Transformed embed URL:", embedUrl);
  } else {
    console.log("No video URL found in property data");
  }

  useEffect(() => {
    if (allImages.length > 0) {
      const fac = new FastAverageColor();
      const img = new window.Image();
      img.crossOrigin = "Anonymous";
      img.src = allImages[0];

      img.onload = () => {
        try {
          const color = fac.getColor(img);
          const closestBg = findClosestColor(color.hex, DARK_SHADES);
          setBgColorName(closestBg);
        } catch (e) {
          console.error("Error extracting color", e);
        }
      };
    }
  }, [allImages]);

  // Scroll to rooms section
  const scrollToRooms = () => {
    const availableRooms = rooms.filter((r) => r.fieldData.available);
    let targetRoomId: string | undefined;

    // Filter "Available Now" rooms using shared logic
    const availableNow = availableRooms.filter((r) => 
      getAvailabilityDate(r) === AVAILABLE_NOW_LABEL
    );

    if (availableNow.length > 0) {
      // Prioritize the first "Available Now" room
      targetRoomId = availableNow[0].id;
    } else if (availableRooms.length > 0) {
      // If no "Available Now", pick the earliest available one
      const sortedByDate = [...availableRooms].sort((a, b) => {
        const dateA = new Date(a.fieldData["available-from"] || 0).getTime();
        const dateB = new Date(b.fieldData["available-from"] || 0).getTime();
        return dateA - dateB;
      });
      targetRoomId = sortedByDate[0].id;
    }

    if (targetRoomId) {
      const roomElement = document.getElementById(`room-${targetRoomId}`);
      if (roomElement) {
        // Offset for sticky header if exists, or just some padding
        const yOffset = -100; 
        const y = roomElement.getBoundingClientRect().top + window.scrollY + yOffset;
        
        // Using scrollIntoView usually works well, but if we need offset we might use window.scrollTo
        // For simplicity and smoother behavior with potentially different screen sizes, let's try standard scrollIntoView first
        // If the user wants specific offset we can adjust. 
        // Let's stick to scrollIntoView with center alignment to make sure it's visible
        roomElement.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }

    // Fallback to generic rooms section
    const roomsSection = document.getElementById("rooms");
    if (roomsSection) {
      roomsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  const backgroundColour2 = property.fieldData["background-colour-2"];
  const backgroundColour2Class = backgroundColour2
    ? WEBFLOW_BACKGROUND_COLOUR_MAP[backgroundColour2]
    : BG_COLOR_MAP[bgColorName as keyof typeof BG_COLOR_MAP] ??
    "bg-ground-brown";
  const textColor =
    TEXT_COLOR[backgroundColour2Class as keyof typeof TEXT_COLOR] ??
    "text-white";

  const availableText = getAvailabilityDateForProperty(rooms);

  return (
    <OpenSection
      className={`h-full lg:h-[100vh] flex flex-col lg:flex-row overflow-hidden transition-colors duration-500`}
    >
      {/* Left Column: 60% - Image Grid */}
      <div className="w-full lg:w-[60%] h-[50vh] lg:h-full relative z-10 pr-0 lg:pr-2 ">
        <div className="w-full h-full overflow-hidden">
          <GridLightBox
            images={allImages}
            propertyName={property.fieldData.name}
            propertyStats={`${property.fieldData["property-bedrooms"]} BHK | ${property.fieldData["carpet-area"]
              } Sq. Ft | ${(property.fieldData["floor-number-new"] || "1st")} Floor`}
            photoCategories={photoCategories}
          />
        </div>
      </div>

      {/* Right Column: 40% - Details */}
      <div
        className={`w-full lg:w-[40%] h-auto lg:h-full relative flex flex-col justify-center p-6 md:p-8 lg:p-16 text-white overflow-hidden ${backgroundColour2Class} transition-colors duration-500`}
      >
        {/* Background Pattern */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none z-10"
          style={{
            backgroundImage: "url(/patterns/autumn.svg)",
            backgroundSize: "24px",
            backgroundRepeat: "repeat",
          }}
        />

        {/* Content Container */}
        <div className="relative z-10">
          {/* Title */}
          <h1
            className={`text-fluid-h1 font-heading mb-8 leading-tight font-zin  ${textColor}`}
          >
            {property.fieldData.name.split(",")[0]}
          </h1>

          {/* Description */}
          {/* <p className="text-sm text-white/60 mb-8 leading-relaxed max-w-lg justify-content-center">
                        {property.fieldData["property-long-description"]}
                    </p> */}

          <div className="flex flex-col gap-6">
            {/* Location */}
            <div className={`flex items-center gap-3 ${textColor}`}>
              <MapPin className="w-5 h-5 shrink-0" />
              <span className="text-lg font-medium font-body">
                {locationName || "Bangalore"}
              </span>
            </div>

            {/* Availability */}
            <div className={`flex items-center gap-3 ${textColor}`}>
              <Calendar className="w-5 h-5 shrink-0" />
              <div className="flex items-center gap-3">
                <span className="text-lg font-medium font-body">
                 {availableText}
                </span>
                {property.fieldData["female-only"] && (
                  <span className="border border-white/40 text-white/90 px-3 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider">
                    Female Only
                  </span>
                )}
              </div>
            </div>

            {/* Stats Row 1: Beds | Area | Floor */}
            <div className={`flex items-center gap-3 ${textColor}`}>
              <Bed className="w-5 h-5 shrink-0" />
              <span className="text-lg font-medium font-body">
                {property.fieldData["property-bedrooms"]} BHK
                <span className="mx-2 opacity-60">|</span>
                {property.fieldData["carpet-area"]} Sq. Ft
                <span className="mx-2 opacity-60">|</span>
                {property.fieldData["floor-number-new"] || "1st"} Floor
              </span>
            </div>

            {/* Stats Row 2: Price */}
            <div className={`flex items-center gap-3 ${textColor}`}>
              <span className="text-xl font-bold w-5 text-center">₹</span>
              <span className="text-lg font-medium font-body">
                Private Rooms from ₹
                {(() => {
                  const rentValue = property.fieldData["rent-in-rupees"];
                  if (!rentValue) return "40,000";
                  // Remove any existing commas and K suffixes, then parse
                  const numericValue = parseInt(rentValue.replace(/,/g, "").replace(/K/gi, "")) || 0;
                  if (numericValue === 0) return "40,000";
                  return numericValue.toLocaleString("en-IN");
                })()}/mo
              </span>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-12 flex flex-col gap-4 w-[80%] md: w-[100%]">
            <Button
              variant="primary"
              size="lg"
              onClick={scrollToRooms}
              leftIcon={<DoorIcon />}
              data-cta-id="cta_show_available_rooms"
            >
              Show Available Rooms
            </Button>

            {embedUrl && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="white"
                    className="!text-black"
                    size="lg"
                    leftIcon={<PlayIcon />}
                    data-cta-id="cta_watch_a_video"
                  >
                    Watch a Video
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px] p-0 bg-black border-none overflow-hidden aspect-video">
                  <DialogTitle className="sr-only">
                    Property Video Tour
                  </DialogTitle>
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </DialogContent>
              </Dialog>
            )}
          </div>
        </div>
      </div>
    </OpenSection>
  );
};
