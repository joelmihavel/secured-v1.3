"use client";
import React, { useState, useLayoutEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { type Location, type Property } from "@/lib/webflow";
import { OpenSection } from "@/components/layout/OpenSection";
import { FlexibleCarousel } from "@/components/ui/flexible-carousel";

// --- Configuration ---
// Neighborhood to image mapping with matching color schemes
const NEIGHBORHOOD_CONFIG: Record<
  string,
  { image: string; scheme: { bg: string; text: string; accent: string } }
> = {
  indiranagar: {
    image: "/Neighbourhoods/Neighbourhood Illustrations Set 01_Indiranagar.png",
    scheme: {
      bg: "bg-forest-green",
      text: "text-night-violet",
      accent: "bg-pastel-violet",
    },
  },
  "mg road": {
    image: "/Neighbourhoods/Neighbourhood Illustrations Set 01_MG Road.png",
    scheme: {
      bg: "bg-ground-brown",
      text: "text-brick-red",
      accent: "bg-pastel-pink",
    },
  },
  bellandur: {
    image: "/Neighbourhoods/Neighbourhood Illustrations Set 02_Bellandur.png",
    scheme: {
      bg: "bg-brick-red",
      text: "text-forest-green",
      accent: "bg-pastel-green",
    },
  },
  haralur: {
    image: "/Neighbourhoods/Neighbourhood Illustrations Set 02_Haralur.png",
    scheme: {
      bg: "bg-night-violet",
      text: "text-ground-brown",
      accent: "bg-pastel-orange",
    },
  },
  "hsr layout": {
    image: "/Neighbourhoods/Neighbourhood Illustrations Set 03_HSR Layout.png",
    scheme: {
      bg: "bg-night-violet",
      text: "text-forest-green",
      accent: "bg-pastel-cyan",
    },
  },
  whitefield: {
    image: "/Neighbourhoods/Neighbourhood Illustrations Set 03_Whitefield.png",
    scheme: {
      bg: "bg-forest-green",
      text: "text-night-violet",
      accent: "bg-pastel-yellow",
    },
  },
};

interface NeighborhoodItem {
  id: string;
  slug: string;
  name: string;
  image: string;
  bgColor: string;
  textColor: string;
  accentColor: string;
  tagline: string;
}

interface NeighborhoodsProps {
  locations: Location[];
  properties: Property[];
  children?: React.ReactNode;
}

export const Neighborhoods = ({
  locations,
  properties,
  children,
}: NeighborhoodsProps) => {
  const [neighborhoods, setNeighborhoods] = useState<NeighborhoodItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  // const [activeColors, setActiveColors] = useState({
  //     bg: "bg-white",
  //     accent: "bg-night-violet",
  //     text: "text-night-violet"
  // });

  // Detect mobile devices
  useLayoutEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Process locations prop
  useLayoutEffect(() => {
    if (locations.length > 0) {
      // Only include neighborhoods that have a dedicated image in the config
      const mappedItems = locations
        .filter((loc) => {
          const locationName = loc.fieldData.name.toLowerCase().trim();
          return NEIGHBORHOOD_CONFIG[locationName] !== undefined;
        })
        .map((loc) => {
          const locationName = loc.fieldData.name.toLowerCase().trim();
          const config = NEIGHBORHOOD_CONFIG[locationName];

          return {
            id: loc.id,
            slug: loc.fieldData.slug,
            name: loc.fieldData.name,
            image: config.image,
            bgColor: config.scheme.bg,
            textColor: config.scheme.text,
            accentColor: config.scheme.accent,
            tagline: "Discover your vibe",
          };
        });

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setNeighborhoods(mappedItems);

      // Set initial active colors
      // if (mappedItems[0]) {
      //     setActiveColors({
      //         bg: mappedItems[0].bgColor,
      //         accent: mappedItems[0].accentColor,
      //         text: mappedItems[0].textColor
      //     });
      // }
    }
  }, [locations, properties]);

  const handleSlideChange = (index: number) => {
    if (neighborhoods[index]) {
      // const newItem = neighborhoods[index];
      // setActiveColors({
      //     bg: newItem.bgColor,
      //     accent: newItem.accentColor,
      //     text: newItem.textColor
      // });
    }
  };

  if (neighborhoods.length === 0) {
    return null;
  }

  const cards = neighborhoods.map((slide) => (
    <Link
      key={slide.id}
      href={`/homes?location=${encodeURIComponent(slide.name)}`}
      className="block h-full w-full"
      draggable={false}
    >
      <div
        className={`flex flex-col rounded-2xl ${slide.bgColor} overflow-hidden shadow-2xl w-full h-full`}
      >
        <div className="px-3 pt-8 md:px-6 md:pt-8 pb-0 text-center z-10">
          <h3 className={`text-lg md:text-2xl font-heading text-white mb-1`}>
            {slide.name}
          </h3>
        </div>

        <div
          className={`relative flex-grow w-full overflow-hidden ${slide.bgColor} mx-auto h-[40vh]`}
        >
          <Image
            src={slide.image}
            alt={slide.name}
            fill
            className="object-cover pointer-events-none invert grayscale contrast-200 mix-blend-screen opacity-90"
          />
        </div>

        {/* Bottom Label */}
        <div
          className={`py-1 md:py-2 ${slide.bgColor} text-white text-center font-heading tracking-wider text-xs md:text-sm z-20`}
        >
          EXPLORE HOMES
        </div>
      </div>
    </Link>
  ));

  return (
    <OpenSection
      id="neighborhoods"
      className={`transition-colors duration-500 ease-in-out overflow-hidden`}
    >
      <div
        className={`absolute inset-0 opacity-10 bg-gradient-to-b from-white via-transparent to-white pointer-events-none`}
      />

      <div className="max-w-16xl relative z-10 py-12">
        <div className="text-center mb-8">
          <h2
            className={`font-heading text-text-main transition-colors duration-500 mb-4`}
          >
            Explore by{" "}
            <span className="font-zin font-light">
              {" "}
              <br /> Neighborhoods
            </span>
          </h2>
        </div>

        {/* 3D Carousel */}
        <div className="relative w-full flex items-center justify-center">
          <FlexibleCarousel
            cards={cards}
            cardWidth={isMobile ? "80vw" : "24vw"}
            isInfinite={true}
            highlightMiddle={true}
            showNavigation={true}
            onSlideChange={handleSlideChange}
            isDraggable={true}
            friction={0.2}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-5xl mx-auto">
          <div className="text-center">
            <p className="text-4xl font-heading font-bold mb-2 text-text-main">
              150+
            </p>
            <p className="text-sm text-text-main opacity-60">
              Homes Launched Across Bangalore
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-heading font-bold mb-2 text-text-main">
              80%
            </p>
            <p className="text-sm text-text-main opacity-60">
              Of our homes are in Tier I gated societies
            </p>
          </div>
          <div className="text-center">
            <p className="text-4xl font-heading font-bold mb-2 text-text-main">
              4.8/5
            </p>
            <p className="text-sm text-text-main opacity-60">
              Avg Rating From Flent Residents
            </p>
          </div>
        </div>
      </div>
      {children}
    </OpenSection>
  );
};
