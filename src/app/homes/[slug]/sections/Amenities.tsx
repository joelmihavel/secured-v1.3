"use client";

import React from "react";
import Image from "next/image";
import { OpenSection } from "@/components/layout/OpenSection";
import { Amenity, Property } from "@/lib/webflow";
import { IconArrowUpRight as ArrowUpRight } from "@tabler/icons-react";

interface AmenitiesProps {
  property: Property;
  amenities: Amenity[];
  allImages: string[];
  slug: string;
}

export const Amenities = ({
  property,
  amenities,
  allImages,
  slug,
}: AmenitiesProps) => {
  if (
    !property.fieldData["apply-discount"] &&
    !property.fieldData["discount-end-date"] &&
    !property.fieldData["discount"]
  ) {
    return null;
  }
  // Use property featured photo, fallback to random image logic
  const featuredPhoto = property.fieldData["property-featured-photo"]?.url;

  // Fallback logic if no featured photo
  const seed = property.id
    .split("")
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const randomImageIndex = seed % (allImages.length || 1);
  const fallbackImage =
    allImages[randomImageIndex] || allImages[0] || "/placeholder.jpg";

  const bgImage = featuredPhoto || fallbackImage;

  // Designer quote subtexts - randomly select one based on property ID
  const designerQuotes = [
    "A lot of the decor you see in the pictures is made in-house. You'll spot that DIY spirit in the lamp makeovers, picture frames, art pieces and corners you only catch once you visit :)",
    "One design detail I'm secretly proud of, and you'll definitely be grateful for, is that there's always a switchboard right where you need it. Yes, we think about things like that :)",
    "When designing this home, we leaned into a few subliminal triggers. Lighting was one. While we prefer warm lights, every light can switch to white if that feels more like home to you. The other was texture. We layered wood, jute, cane and cotton throughout the space. You may not notice it at first, but it grounds you the moment you walk in :)",
    "A flat flips into a Flent home in just 5 days! Those days are chaotic in the best way. We plan the basic structure, sure, but most of what you see in the photos was never on a moodboard. It comes together in the moment. The wall detailing, lamp makeovers and art pieces are all created in-house by a team of three designers who respond to what the space needs. That is why every Flent home ends up one of a kind. We design with instinct, not templates :)",
    "You might think the home is just styled to look good, but once you start living you'll see it is set up to work for you. The workspace is actually comfortable for long hours, switchboards are exactly where your hand reaches for them, the blackout curtains have your back on slow mornings, and no corner ever feels cramped :)",
    "All the common areas are designed for hosting with ease. With ample seating, ambient lighting and some Instagrammable corners, this home is always ready for a party :)",
  ];
  const randomQuoteIndex = seed % designerQuotes.length;
  const selectedQuote = designerQuotes[randomQuoteIndex];

  const discountEndDate = property.fieldData["discount-end-date"]
    ? new Date(
        property.fieldData["discount-end-date"] as string
      ).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <OpenSection id="amenities" className="bg-bg-white">
      {/* Top: Full-width Image with Text and CTA */}
      <div className="w-full relative aspect-[16/9] md:aspect-[2.5/1] overflow-hidden">
        <Image
          src={bgImage}
          alt="Property Amenity Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" /> {/* Dark Overlay */}
        {/* Text and CTA Overlay */}
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl flex flex-col items-center mx-auto px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 bg-brand-pink/90 px-3 py-1 md:px-4 md:py-2 rounded-full mb-4">
              <span className="text-xs md:text-sm font-medium text-text-main">
                ✨ Holiday Offer
              </span>
            </div>
            <h2 className="font-heading text-white text-3xl md:text-fluid-h2 font-bold mb-6 text-center">
              Save {property.fieldData["discount"]}% month if{" "}
              <br className="hidden md:block" />
              booked by {discountEndDate}
            </h2>
            <a
              href={`https://cal.com/flent/home-visit?property-name=${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white text-text-main px-6 py-3 md:px-8 md:py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-white/90 transition-colors text-sm md:text-base"
            >
              Book a Tour
              <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom: Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-stretch mx-auto">
          {/* Amenities List (60%) */}
          <div className="w-full lg:w-[60%]">
            <h3 className="font-fluid-heading text-2xl md:text-fluid-h2 text-text-main mb-6 md:mb-8">
              This home comes with
            </h3>

            <div className="flex flex-wrap gap-3 md:gap-4">
              {amenities.map((amenity, index) => {
                // Cycle through pastel backgrounds
                const pastelColors = [
                  "bg-pastel-brown",
                  "bg-pastel-violet",
                  "bg-pastel-green",
                  "bg-pastel-orange",
                  "bg-pastel-pink",
                  "bg-pastel-cyan",
                  "bg-pastel-red",
                  "bg-pastel-yellow",
                ];
                const bgColor = pastelColors[index % pastelColors.length];

                return (
                  <div
                    key={amenity.id}
                    className={`flex items-center gap-2 md:gap-3 px-4 py-2 md:px-6 md:py-3 rounded-full border border-text-main ${bgColor}`}
                  >
                    {amenity.fieldData.icon && (
                      <Image
                        src={amenity.fieldData.icon.url}
                        alt={amenity.fieldData.name}
                        width={20}
                        height={20}
                        className="w-4 h-4 md:w-5 md:h-5 text-text-main"
                      />
                    )}
                    <span className="font-medium text-text-main text-sm md:text-base">
                      {amenity.fieldData.name}
                    </span>
                  </div>
                );
              })}
              {/* Fallback if no amenities */}
              {amenities.length === 0 && (
                <p className="text-text-main/60">
                  No specific amenities listed.
                </p>
              )}
            </div>
          </div>

          {/* Designer Quote (40%) */}
          <div id="notes-from-designer" className="w-full lg:w-[40%]">
            <div className="bg-[#8B5E3C] rounded-3xl p-8 md:p-10 text-white relative overflow-hidden h-full flex flex-col justify-center shadow-2xl">
              {/* Background Pattern Overlay */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: "url(/patterns/moroccan.svg)",
                  backgroundRepeat: "repeat",
                  opacity: 0.1,
                  maskImage:
                    "linear-gradient(to bottom, black 0%, transparent 20%, transparent 80%, black 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 0%, transparent 20%, transparent 80%, black 100%)",
                }}
              />

              <div className="relative z-10">
                <h3 className="font-heading text-2xl md:text-3xl text-white mb-6">
                  Notes from Designer
                </h3>

                <p className="text-lg leading-relaxed text-white/90 mb-8 font-light">
                  {selectedQuote}
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-brand-pink bg-pastel-pink relative">
                    {/* Placeholder for designer image */}
                    <Image
                      src="/team-photos-normalized/purva_jadhav.webp"
                      alt="Designer"
                      fill
                      className="object-contain scale-150"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                        e.currentTarget.parentElement!.style.backgroundColor =
                          "#D4A373";
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-bold !text-white text-subtitle-lg">
                      Purva Jadhav
                    </p>
                    <p className="!text-white/70 text-subtitle-sm">
                      Product Ops at Flent
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </OpenSection>
  );
};
