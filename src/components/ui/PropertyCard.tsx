"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconBed as Bed,
  IconBath as Bath,
  IconSquare as Square,
  IconMapPin as MapPin,
  IconArrowRight as ArrowRight,
  IconArrowUpRight as ArrowUpRight,
  IconCalendar as Calendar,
  IconDoor as DoorOpen,
  IconUsers as Users,
  IconBuilding as Building2,
  IconX,
} from "@tabler/icons-react";
import { Property, Room, Occupant } from "@/lib/webflow";
import { Button } from "@/components/ui/Button";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { PhoneSubscribeForm } from "@/components/ui/PhoneSubscribeForm";
import { cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  index?: number;
  locationName?: string;
  variant?: "default" | "coming-soon";
  rooms?: Room[];
  occupants?: Occupant[];
}

// Inline CompanyPill Component
const CompanyPill = ({
  company,
  logoFile,
}: {
  company: string;
  logoFile?: string;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative flex items-center gap-2 rounded-xl overflow-hidden cursor-default h-[34px] max-w-[12ch]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      initial={false}
      animate={{
        width: isHovered ? "auto" : "32px",
        paddingRight: isHovered ? "12px" : "0px",
        paddingLeft: isHovered ? "4px" : "0px",
        paddingTop: isHovered ? "4px" : "0px",
        paddingBottom: isHovered ? "4px" : "0px",
        backgroundColor: isHovered
          ? "rgb(243, 244, 246)"
          : "rgba(243, 244, 246, 0)",
      }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
    >
      {/* Logo or Icon */}
      <div className="relative w-6 h-6 flex-shrink-0 flex items-center justify-center">
        {logoFile ? (
          <Image
            src={`/company-logo/${logoFile}`}
            alt={company}
            fill
            className="object-contain"
            style={{ borderRadius: "100%" }}
          />
        ) : (
          <Building2 size={16} className="text-gray-600" />
        )}
      </div>

      {/* Company Name - Animated */}
      <motion.span
        className="text-xs font-medium text-gray-700 font-body truncate"
        initial={false}
        animate={{
          maxWidth: isHovered ? "200px" : "0px",
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
        style={{
          display: "inline-block",
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {company}
      </motion.span>
    </motion.div>
  );
};

export const PropertyCard = ({
  property,
  locationName,
  variant = "default",
  rooms = [],
  occupants = [],
}: PropertyCardProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Build array of all available images
  const images = [
    property.fieldData["property-thumbnail"]?.url ||
      property.fieldData["property-featured-photo"]?.url,
    ...(property.fieldData["property-photos"]?.map((photo) => photo.url) || []),
  ].filter(Boolean) as string[];

  const imageUrl = images[currentImageIndex] || "/images/placeholder.jpg";

  useEffect(() => {
    if (isHovering && images.length > 1 && variant !== "coming-soon") {
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % images.length);
      }, 2000);

      return () => clearInterval(interval);
    }
  }, [isHovering, images.length, variant]);

  const isComingSoon = variant === "coming-soon";
  const isOccupied = !isComingSoon && !property.fieldData.available;

  // Calculate derived data
  const propertyRoomIds = property.fieldData.rooms || [];
  const propertyRooms = rooms.filter((r) => propertyRoomIds.includes(r.id));
  const totalRooms = propertyRoomIds.length;
  const availableRooms = propertyRooms.filter(
    (r) => r.fieldData.available
  ).length;

  // Get companies
  const companies = React.useMemo(() => {
    const companySet = new Set<string>();
    propertyRooms.forEach((room) => {
      if (room.fieldData.occupant) {
        const occupant = occupants.find(
          (o) => o.id === room.fieldData.occupant
        );
        if (occupant && occupant.fieldData.company) {
          companySet.add(occupant.fieldData.company);
        }
      }
    });
    return Array.from(companySet);
  }, [propertyRooms, occupants]);

  const companyLogos: Record<string, string> = {
    Freshworks: "freshworks.png",
    "Wisdom AI": "wisdom_ai.png",
    Finbox: "finbox.png",
    HSBC: "hsbc.png",
    Adotco: "adotco.png",
    Quizizz: "quizizz.png",
    Bigbasket: "bigbasket.png",
    "Goldman Sachs": "goldman_sachs.png",
    "ZS Associates": "zs_associates.png",
    "Sambanova Systems": "sambanova_systems.png",
    BCG: "bcg.png",
    "Lucio AI": "lucio_ai.png",
    "Spectral insights": "spectral_insights.png",
    Smallcase: "smallcase.png",
    "Hashed Em": "hashed_em.png",
    Entalpic: "entalpic.png",
    Goodera: "goodera.png",
    Turno: "turno.png",
    Citi: "citi.png",
    "Elevation Capital": "elevation_capital.png",
    Aspire: "aspire.png",
    Ultrahuman: "ultrahuman.png",
    Cashfree: "cashfree.png",
    Zepto: "zepto.png",
    Janes: "janes.png",
    Glean: "glean.png",
    Google: "google.png",
    "Pocket FM": "pocket_fm.png",
    Uber: "uber.png",
    Atlassian: "atlassian.png",
    Flipkart: "flipkart.png",
    Semrush: "semrush.png",
    Emergent: "emergent.png",
    "Vector Consulting": "vector_consulting.png",
    Grab: "grab.png",
    Indegene: "indegene.png",
    Foxconn: "foxconn.png",
    "Bahwan Cybertek": "bahwan_cybertek.png",
    "Fintech Startup": "fintech_startup.png",
    ThoughtSpot: "thoughtspot.png",
    Razorpay: "razorpay.png",
    Pidilite: "pidilite.png",
    Amazon: "amazon.png",
    Nference: "nference.png",
    Livspace: "livspace.png",
    "Cigna Healthcare": "cigna_healthcare.png",
    "AB InBev": "ab_inbev.png",
    Nielsen: "nielsen.png",
    Maxval: "maxval.png",
    Wayfair: "wayfair.png",
    "Microsoft India": "microsoft_india.png",
    "Novo Nordisk": "novo_nordisk.png",
    Shopdeck: "shopdeck.png",
    "Applied Intuition": "applied_intuition.png",
    Meesho: "meesho.png",
    "Flash.co": "flash_co.png",
    Anyscale: "anyscale.png",
    "Blink Health": "blink_health.png",
    "Juniper Networks": "juniper_networks.png",
    SpotDraft: "spotdraft.png",
    E6Data: "e6data.png",
    Gameskraft: "gameskraft.png",
    "Optimo Capital": "optimo_capital.png",
    Abinbev: "abinbev.png",
    Dvsi: "dvsi.png",
    Groww: "groww.png",
    Udaan: "udaan.png",
    "Movado Group": "movado_group.png",
    "Publicis Sapient": "publicis_sapient.png",
    Rippling: "rippling.png",
    "The Thinkers": "the_thinkers.png",
    Navi: "navi.png",
    HFT: "hft.png",
    Salesforce: "salesforce.png",
    Cohesity: "cohesity.png",
    Npdi: "npdi.png",
    "Agilitas Sports": "agilitas_sports.png",
    Stripe: "stripe.png",
    Zamp: "zamp.png",
    "Fidelity International": "fidelity_international.png",
    Reach: "reach.png",
    "Capria Ventures": "capria_ventures.png",
    Vantiva: "vantiva.png",
    Microsoft: "microsoft.png",
    Accenture: "accenture.png",
    Zeta: "zeta.png",
    "Mercedes-Benz": "mercedes_benz.png",
    MIQ: "miq.png",
    "JP Morgan & Chase": "jp_morgan___chase.png",
    Delhivery: "delhivery.png",
    Swiggy: "swiggy.png",
    Narvar: "narvar.png",
    Azentio: "azentio.png",
    "Rystad Energy": "rystad_energy.png",
    Myntra: "myntra.png",
    Gojek: "gojek.png",
    PushOwl: "pushowl.png",
    Cognizant: "cognizant.png",
    "The Media Ant": "the_media_ant.png",
  };

  // Use uniform pastel-pink background with black text/icon for all locations
  const locationColors = {
    bg: "bg-pastel-pink",
    text: "text-black",
  };

  return (
    <div
      className={`flex flex-col relative w-full h-full ${
        isOccupied ? "opacity-60" : ""
      }`}
    >
      <div
        className={`group/card rounded-t-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col relative bg-white h-full ${
          isOccupied ? "pointer-events-none" : ""
        }`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => {
          setIsHovering(false);
          setCurrentImageIndex(0);
        }}
      >
        {/* Location Tag in Top Right */}
        {locationName && (
          <div
            className={`absolute top-3 md:top-4 right-3 md:right-4 z-10 px-2 md:px-4 py-1 md:py-2 rounded-t-[1rem] ${locationColors.bg} ${locationColors.text} flex items-center gap-1 md:gap-1`}
          >
            <MapPin size={12} className="md:w-[14px] md:h-[14px]" />
            <span className="text-subtitle-sm font-medium font-body">
              {locationName}
            </span>
          </div>
        )}

        {/* Image Section */}
        <div className="relative h-[300px] md:h-[340px] w-full bg-gray-100 overflow-hidden shrink-0">
          <AnimatePresence initial={false}>
            <motion.div
              key={currentImageIndex}
              initial={{
                opacity: 0,
                filter: isComingSoon ? "blur(20px)" : "blur(10px)",
              }}
              animate={{
                opacity: 1,
                filter: isComingSoon ? "blur(20px)" : "blur(0px)",
              }}
              exit={{
                opacity: 0,
                filter: isComingSoon ? "blur(20px)" : "blur(10px)",
              }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0"
            >
              <Image
                src={imageUrl}
                alt={property.fieldData.name}
                fill
                className={`object-cover transition-transform duration-700 ${
                  !isComingSoon ? "group-hover/card:scale-110" : ""
                } pointer-events-none`}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Content Section */}
        <div className="p-4 md:p-6 flex flex-col gap-2 md:gap-3 bg-white flex-grow">
          {/* Title */}
          <div className="flex items-center gap-2 pb-2">
            <h3 className="text-fluid-h3 font-zin text-text-main leading-tight line-clamp-1">
              {property.fieldData.name.split(",")[0]}
            </h3>
            <ArrowUpRight className="w-6 h-6 shrink-0 opacity-0 -translate-x-2 group-hover/card:opacity-100 group-hover/card:translate-x-0 transition-all duration-300 ease-out text-text-main" />
          </div>

          {isComingSoon ? (
            /* Coming Soon Variant Content */
            <>
              {/* Availability Date */}
              <div className="flex items-center gap-2 text-text-main/80">
                <Calendar size={18} className="md:w-5 md:h-5" />
                <span className="font-body text-sm md:text-base">
                  {property.fieldData["available-from"]
                    ? `Available from ${new Date(
                        property.fieldData["available-from"]
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}`
                    : "Coming Soon"}
                </span>
              </div>

              {/* BHK & Area */}
              <div className="flex items-center gap-4 text-text-main/80">
                <div className="flex items-center gap-2">
                  <Bed size={18} className="md:w-5 md:h-5" />
                  <span className="font-body text-sm md:text-base">
                    {property.fieldData["property-bedrooms"]} BHK
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Square size={18} className="rotate-45 md:w-5 md:h-5" />
                  <span className="font-body text-sm md:text-base">
                    {property.fieldData["carpet-area"]} Sq. Ft
                  </span>
                </div>
              </div>

              {/* Private Rooms Price */}
              <div className="flex items-center gap-2 text-text-main/80">
                <span className="font-body text-lg font-medium">₹</span>
                <span className="font-body text-sm md:text-base">
                  Private Rooms: ₹
                  {parseInt(property.fieldData["rent-in-rupees"] || "0")
                    .toLocaleString()
                    .replace(/,/g, "")
                    .slice(0, -3)}
                  K/mo
                </span>
              </div>

              {/* Get Launch Invite Button */}
              <div className="mt-auto pt-3">
                <DialogPrimitive.Root
                  open={isDialogOpen}
                  onOpenChange={setIsDialogOpen}
                >
                  <Button
                    variant="primary"
                    pastelColor="violet"
                    size="md"
                    className="w-full rounded-full"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Get Launch Invite
                  </Button>
                  <AnimatePresence>
                    {isDialogOpen && (
                      <DialogPrimitive.Portal forceMount>
                        <DialogPrimitive.Overlay asChild>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="fixed inset-0 z-50 bg-black/80"
                          />
                        </DialogPrimitive.Overlay>
                        <DialogPrimitive.Content asChild>
                          <motion.div
                            initial={{
                              opacity: 0,
                              scale: 0.95,
                              y: "-40%",
                              x: "-50%",
                              filter: "blur(10px)",
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                              y: "-50%",
                              x: "-50%",
                              filter: "blur(0px)",
                            }}
                            exit={{
                              opacity: 0,
                              scale: 0.95,
                              y: "-40%",
                              x: "-50%",
                              filter: "blur(10px)",
                            }}
                            transition={{
                              type: "spring",
                              damping: 25,
                              stiffness: 300,
                              duration: 0.3,
                            }}
                            className={cn(
                              "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg gap-4 border p-6 shadow-lg sm:rounded-lg",
                              "bg-ground-brown text-white border-white/20 sm:max-w-md"
                            )}
                          >
                            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
                              <DialogPrimitive.Title className="text-2xl font-zin text-white">
                                Get Launch Invite
                              </DialogPrimitive.Title>
                              <DialogPrimitive.Description className="text-white/80">
                                We&apos;ll notify you when{" "}
                                {property.fieldData.name.split(",")[0]} becomes
                                available.
                              </DialogPrimitive.Description>
                            </div>
                            <div className="mt-4">
                              <PhoneSubscribeForm
                                propertyInterest={property.fieldData.name}
                                placeholder="Enter your phone number"
                                buttonText="Get Invite"
                                className="max-w-full"
                              />
                            </div>
                            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                              <IconX className="h-4 w-4 text-white" />
                              <span className="sr-only">Close</span>
                            </DialogPrimitive.Close>
                          </motion.div>
                        </DialogPrimitive.Content>
                      </DialogPrimitive.Portal>
                    )}
                  </AnimatePresence>
                </DialogPrimitive.Root>
              </div>
            </>
          ) : (
            /* Default Variant Content */
            <>
              {/* Availability & Tags */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* {property.fieldData.available ? (
                  <div className="flex items-center gap-1 md:gap-2 text-text-main/80">
                    <Calendar size={16} className="md:w-[18px] md:h-[18px]" />
                    <span className="font-body font-medium text-xs">
                      Available Now
                    </span>
                  </div>
                ) : property.fieldData["available-from"] ? (
                  <div className="flex items-center gap-1 md:gap-2 text-text-main/80">
                    <Calendar size={16} className="md:w-[18px] md:h-[18px]" />
                    <span className="font-body font-medium text-xs">
                      Available from{" "}
                      {new Date(
                        property.fieldData["available-from"]
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                ) : (
                  <Occupied />
                )} */}
                {property.fieldData.available === false ? (
                  <Occupied />
                ) : (
                  <Available
                    availableFrom={property.fieldData["available-from"]}
                  />
                )}
                {property.fieldData["female-only"] && (
                  <span className="bg-pink-200 text-pink-800 px-3 py-1 rounded-full text-xs font-bold font-body">
                    Female Only
                  </span>
                )}
              </div>

              <div className="h-px bg-gray-100 w-full" />

              {/* Stats Row */}
              <div className="flex items-center justify-between text-text-main/80">
                <div className="flex items-center gap-1 md:gap-2">
                  <Bed size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="font-body text-xs font-medium">
                    {property.fieldData["property-bedrooms"]} BHK
                  </span>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <Square
                    size={16}
                    className="rotate-45 md:w-[18px] md:h-[18px]"
                  />
                  <span className="font-body text-xs font-medium">
                    {property.fieldData["carpet-area"]} Sq. Ft
                  </span>
                </div>
                <div className="flex items-center gap-1 md:gap-2">
                  <DoorOpen size={16} className="md:w-[18px] md:h-[18px]" />
                  <span className="font-body text-xs font-medium">
                    {availableRooms}/{totalRooms} Available
                  </span>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full" />

              {/* Flatmates Section with CompanyPill */}
              <div className="flex items-center gap-2 md:gap-3 min-w-0 overflow-hidden min-h-[34px]">
                <div className="flex items-center gap-1 md:gap-2 text-text-main/80 flex-shrink-0">
                  <Users
                    size={16}
                    className="md:w-[18px] md:h-[18px] flex-shrink-0"
                  />
                  {totalRooms > 0 && availableRooms === totalRooms ? (
                    /* All rooms available */
                    <span className="font-body text-xs font-medium leading-tight">
                      {property.fieldData["property-bedrooms"] === 1
                        ? "All yours, no flatmate sharing"
                        : "You'll be the first occupant in this house"}
                    </span>
                  ) : (
                    <span className="font-body text-xs font-medium whitespace-nowrap leading-tight">
                      Flatmates from
                    </span>
                  )}
                </div>
                {/* Only show company pills if not all rooms are available */}
                {!(totalRooms > 0 && availableRooms === totalRooms) && (
                  <div className="flex items-center gap-2 overflow-hidden flex-shrink min-w-0">
                    {companies.length > 0 ? (
                      companies.slice(0, 3).map((company, idx) => {
                        const logoFile = Object.entries(companyLogos).find(
                          ([key]) =>
                            company.toLowerCase().includes(key.toLowerCase())
                        )?.[1];

                        return (
                          <CompanyPill
                            key={idx}
                            company={company}
                            logoFile={logoFile}
                          />
                        );
                      })
                    ) : (
                      <span className="text-xs text-gray-400 font-body italic leading-tight">
                        --
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="h-px bg-gray-100 w-full mt-auto" />

              {/* Price */}
              <div className="pt-2">
                <span className="text-fluid-h3 font-zin text-text-main">
                  From ₹
                  {parseInt(
                    property.fieldData["rent-in-rupees"] || "0"
                  ).toLocaleString()}
                </span>
                <span className="text-[10px] text-text-main/60 font-body ml-1">
                  / month (per room)
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const Occupied = () => (
  <div className="flex items-center gap-1 md:gap-2 bg-brick-red text-black px-3 py-1 rounded-full">
    <Calendar size={16} className="md:w-[18px] md:h-[18px] text-white" />
    <span className="font-body font-medium text-xs text-white">Occupied</span>
  </div>
);

const Available = ({
  availableFrom,
}: {
  availableFrom: string | undefined;
}) => {
  const availableFromText = getAvailableFromText(availableFrom);
  return (
    <div className="flex items-center gap-1 md:gap-2 text-text-main/80">
      <Calendar size={16} className="md:w-[18px] md:h-[18px]" />
      <span className="font-body font-medium text-xs">{availableFromText}</span>
    </div>
  );
};

const getAvailableFromText = (availableFrom: string | undefined) => {
  if (availableFrom) {
    const availableFromDate = new Date(availableFrom);
    const today = new Date();
    const diffTime = today.getTime() - availableFromDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) {
      return "Available now";
    }

    if (diffDays < 0 && diffDays >= -30) {
      return "Available now";
    }

    // for dates 30+ days in future
    return (
      "Available from " +
      availableFromDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    );
  }

  return "Available now";
};
