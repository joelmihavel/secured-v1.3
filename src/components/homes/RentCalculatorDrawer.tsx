import React, { useState, useEffect } from "react";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/Button";
import {
  IconChevronUp as ChevronUp,
  IconChevronDown as ChevronDown,
  IconChevronLeft as ChevronLeft,
  IconInfoCircle as Info,
  IconPhone as PhoneIcon,
  IconBrandWhatsapp as WhatsAppIcon,
} from "@tabler/icons-react";
import {
  RentBreakdown,
  ADD_ONS,
  formatCurrency,
  getRoomRentBreakdown,
  getPropertyRentBreakdown,
  LockInPeriod,
} from "@/lib/property-utils";
import { Property, Room } from "@/lib/webflow";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { LockInSlider } from "@/components/homes/LockInSlider";
import { useCTATracking } from "@/hooks/useCTATracking";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getPropertyWhatsappLink } from "@/constants";
import { useMobile } from "@/hooks/useMobile";
import { openChat } from "@/lib/open-chat";

interface RentCalculatorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  image: string;
  lockInPeriod: LockInPeriod;
  breakdown: RentBreakdown;
  room?: Room;
  property?: Property;
  slug: string;
  propertyName: string;
}

export const RentCalculatorDrawer = ({
  isOpen,
  onClose,
  title,
  image,
  lockInPeriod: initialLockIn,
  breakdown: initialBreakdown,
  room,
  property,
  slug,
  propertyName,
}: RentCalculatorDrawerProps) => {
  const isMobile = useMobile();
  const { trackCTAClick } = useCTATracking();
  const [isBreakdownVisible, setIsBreakdownVisible] = useState(true);
  const [selectedLockIn, setSelectedLockIn] =
    useState<LockInPeriod>(initialLockIn);
  const [breakdown, setBreakdown] = useState<RentBreakdown>(initialBreakdown);

  // Update local state when props change
  useEffect(() => {
    setSelectedLockIn(initialLockIn);
    setBreakdown(initialBreakdown);
  }, [initialLockIn, initialBreakdown]);

  const handleLockInChange = (lockIn: LockInPeriod) => {
    setSelectedLockIn(lockIn);
    if (room) {
      setBreakdown(getRoomRentBreakdown(room, lockIn));
    } else if (property) {
      setBreakdown(getPropertyRentBreakdown(property, lockIn));
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="h-[90vh] md:h-[95vh] rounded-t-[20px] outline-none">
        <DrawerTitle className="sr-only">{title}</DrawerTitle>
        <div className="h-full overflow-y-auto">
          <div className="container mx-auto px-4 md:px-6 py-4 md:py-6 max-w-6xl">
            {/* Header */}
            <div
              className="flex items-center gap-1.5 md:gap-2 mb-6 md:mb-8 cursor-pointer w-fit"
              onClick={() => {
                trackCTAClick({
                  cta_id: "rent_calculator_back",
                  cta_text: "Back to Apartment",
                  cta_type: "button",
                  page_section: "rent_calculator_drawer",
                });
                onClose();
              }}
            >
              <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
              <span className="text-xs md:text-sm font-medium">
                <span className="hidden sm:inline">Back to Apartment</span>
                <span className="sm:hidden">Back</span>
              </span>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 md:gap-12 lg:gap-24">
              {/* Left Column */}
              <div className="lg:w-1/2 space-y-6 md:space-y-8">
                {/* Room Info */}
                <div className="flex items-start gap-3 md:gap-4">
                  <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl md:rounded-2xl overflow-hidden shrink-0">
                    <Image
                      src={image}
                      alt={title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h2 className="text-fluid-h3 font-heading text-text-main mb-1 md:mb-2">
                      {title}
                    </h2>
                    <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-text-main/60">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="flex items-center gap-1 hover:text-text-main transition-colors cursor-pointer group">
                            <Info className="w-3 h-3 md:w-3.5 md:h-3.5" />
                            <span>Lock In Period: {selectedLockIn} months</span>
                            <ChevronDown className="w-3 h-3 transition-transform group-data-[state=open]:rotate-180" />
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-4" align="start">
                          <div className="space-y-3">
                            <p className="text-xs text-text-main/60">
                              Select your commitment period
                            </p>
                            <LockInSlider
                              value={selectedLockIn}
                              onChange={handleLockInChange}
                            />
                            <p className="text-[10px] text-text-main/50 text-center">
                              Longer lock-in = lower rent
                            </p>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                {/* Rent Breakdown */}
                <div>
                  <div
                    className="flex items-center justify-between mb-4 cursor-pointer select-none"
                    onClick={() => {
                      trackCTAClick({
                        cta_id: "rent_calculator_breakdown_toggle",
                        cta_text: isBreakdownVisible ? "Hide Breakdown" : "Show Breakdown",
                        cta_type: "button",
                        page_section: "rent_calculator_drawer",
                      });
                      setIsBreakdownVisible(!isBreakdownVisible);
                    }}
                  >
                    <h3 className="text-base md:text-lg font-medium text-text-main">
                      Rent Breakdown
                    </h3>
                    <div className="flex items-center gap-1 text-xs md:text-sm text-emerald-500 font-medium">
                      {isBreakdownVisible ? "Hide Breakdown" : "Show Breakdown"}
                      {isBreakdownVisible ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {isBreakdownVisible && (
                    <div className="space-y-3 md:space-y-4">
                      <div className="flex justify-between text-xs md:text-sm text-text-main/80">
                        <span>Base Rent</span>
                        <span>{formatCurrency(breakdown.baseRent)}</span>
                      </div>
                      <div className="flex justify-between text-xs md:text-sm text-text-main/80">
                        <span>Building Maintenance</span>
                        <span>{formatCurrency(breakdown.maintenance)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-text-main/80">
                        <span>Furnishing</span>
                        <span>{formatCurrency(breakdown.furnishing)}</span>
                      </div>
                      <div className="flex justify-between text-sm text-text-main/80">
                        <span>Convenience</span>
                        <span>{formatCurrency(breakdown.convenience)}</span>
                      </div>
                      <div className={cn(
                        "flex justify-between text-sm text-text-main/80",
                        (!breakdown.lockInDiscount || breakdown.lockInDiscount <= 0) && "pb-4 border-b border-gray-100"
                      )}>
                        <span>GST</span>
                        <span>{formatCurrency(breakdown.gst)}</span>
                      </div>
                      {(breakdown.lockInDiscount || 0) > 0 && (
                        <div className="flex justify-between text-sm text-emerald-500 font-medium pb-4 border-b border-gray-100">
                          <span>Lock-in Discount</span>
                          <span>- {formatCurrency(breakdown.lockInDiscount)}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm md:text-base font-bold text-text-main pt-2">
                        <span>Total Rent</span>
                        <span>{formatCurrency(breakdown.totalRent)}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* One-Time Charges */}
                <div>
                  <h3 className="text-base md:text-lg font-medium text-text-main mb-3 md:mb-4">
                    One-Time Charges
                  </h3>
                  <div className="flex justify-between text-xs md:text-sm text-text-main/80">
                    <span>Society Move-In Fee</span>
                    <span className="text-text-main/50">
                      as per society norms
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2.5 md:space-y-3 pt-3 md:pt-4">
                  <Button
                    size="md"
                    className="w-full"
                    href={`${process.env.NEXT_PUBLIC_CAL_URL}?property-name=${slug}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    data-cta-id="rent_calculator_book_tour"
                    data-cta-context="rent_calculator_drawer"
                  >
                    Book a Tour
                  </Button>
                  <Button
                    size="md"
                    variant="ghost"
                    className="w-full bg-white"
                    target="_blank"
                    rel="noopener noreferrer"
                    href={getPropertyWhatsappLink(propertyName)}
                    leftIcon={!isMobile ? <PhoneIcon /> : <WhatsAppIcon />}
                    data-cta-id="rent_calculator_talk_to_us"
                    data-cta-context="rent_calculator_drawer"
                    onClick={(e: React.MouseEvent<HTMLAnchorElement>) => {
                      if (!isMobile) {
                        e.preventDefault();
                        openChat(getPropertyWhatsappLink(propertyName));
                      }
                    }}
                  >
                    {!isMobile ? "Get a Call Back" : "Talk to us"}
                  </Button>
                </div>
              </div>

              {/* Right Column */}
              <div className="lg:w-1/2 space-y-6 md:space-y-10">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-pastel-brown/30 rounded-xl md:rounded-2xl p-4 md:p-6 text-center">
                    <p className="text-xs md:text-sm font-medium text-text-main mb-3 md:mb-4">
                      Monthly Rent
                    </p>
                    <div className="text-fluid-h3 font-heading text-text-main mb-1.5 md:mb-2">
                      {formatCurrency(breakdown.totalRent)}{" "}
                      <span className="text-sm md:text-base font-body text-text-main/70">
                        / mo
                      </span>
                    </div>
                    <p className="text-[10px] md:text-xs text-text-main/60">
                      GST Included
                    </p>
                  </div>
                  <div className="bg-pastel-brown/30 rounded-xl md:rounded-2xl p-4 md:p-6 text-center">
                    <p className="text-xs md:text-sm font-medium text-text-main mb-3 md:mb-4">
                      Deposit Charges
                    </p>
                    <div className="text-fluid-h3 font-heading text-text-main mb-1.5 md:mb-2">
                      {formatCurrency(breakdown.deposit)}
                    </div>
                    <p className="text-[10px] md:text-xs text-text-main/60">
                      (Refundable)
                    </p>
                  </div>
                </div>

                {/* Add-Ons */}
                <div>
                  <h3 className="text-base md:text-lg font-medium text-text-main mb-1.5 md:mb-2">
                    Add-Ons
                  </h3>
                  <p className="text-xs md:text-sm text-text-main/60 mb-4 md:mb-6">
                    Prices listed are approximate per room. Flent doesn&apos;t
                    manage these services.
                  </p>

                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {ADD_ONS.map((addon, index) => (
                      <div
                        key={index}
                        className={cn(
                          "px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium",
                          // Alternating colors based on screenshot approximation or random assignment
                          // Screenshot shows: Maid (gray), Electricity (pink), Water (gray), Wifi (green), Cook (pink), Car Parking (gray), Key (green), Move-In (purple), BGV (gray)
                          // I'll just use a simple cycle or specific mapping if I want to match exactly.
                          // Let's use a simple cycle for variety.
                          index % 4 === 0
                            ? "bg-gray-100 text-gray-700"
                            : index % 4 === 1
                              ? "bg-pastel-red/30 text-text-main"
                              : index % 4 === 2
                                ? "bg-pastel-green/30 text-text-main"
                                : "bg-pastel-violet/30 text-text-main"
                        )}
                      >
                        {addon.name}{" "}
                        <span className="opacity-60">
                          + {formatCurrency(addon.price)}
                          {addon.unit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};
