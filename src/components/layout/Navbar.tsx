"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { IconMenu2 as Menu, IconArrowLeft as ArrowLeft, IconArrowRight as ArrowRight } from "@tabler/icons-react";
import { Button } from "@/components/ui/Button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { WHATSAPP_LINK } from "@/constants";

const defaultNavLinks = [
    { name: "All Homes", href: "/homes", sectionId: "" },
    { name: "Secured", href: "/secured", sectionId: "" },
];

type NavbarVariant = "hamburger" | "expanded" | "secure";

interface NavbarProps {
    /**
     * Variant 1 (hamburger) - Used in property detail pages as well as on all pages on mobile
     * Variant 2 (expanded) - Used on Homepage, About, Homes listing, Owners pages (desktop only)
     * Variant 3 (secure) - Used on Flent Secure pages with specific tabs
     */
    variant?: NavbarVariant;
    activeTab?: string;
    onTabChange?: (tab: string) => void;
}

export const Navbar = ({ variant, activeTab, onTabChange }: NavbarProps) => {
    const pathname = usePathname();
    const isSecurePath = pathname.startsWith("/secured");

    // If it's a secure path BUT variant is not secure, it means it's the global Navbar in layout.tsx.
    // We hide it because the secure page provides its own Navbar instance with the correct variant and state.
    if (isSecurePath && variant !== "secure") return null;

    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [canHover, setCanHover] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(hover: hover)");
        setCanHover(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);

    const router = useRouter();
    const isHome = pathname === "/";
    const isPropertyDetail = pathname.startsWith('/homes/') && pathname.split('/').length === 3;
    const { neighborhoodName, neighborhoodId } = useBreadcrumb();

    // Determine effective variant:
    // - If variant is explicitly set, use it
    // - If on property detail page, auto-use hamburger
    // - Otherwise default to expanded (shows hamburger on mobile via CSS)
    const effectiveVariant = variant ?? (isPropertyDetail ? "hamburger" : "expanded");
    const showExpandedNav = effectiveVariant === "expanded";

    // Close menu on outside click
    useEffect(() => {
        if (!isOpen) return; // Only listen when menu is open

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;

            // Check if click is outside the menu container
            // The menu button is inside the container, so it's already excluded
            if (
                menuRef.current &&
                !menuRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        // Small delay to prevent immediate close from the toggle click
        const timeoutId = setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 0);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen]);

    const handleWhatsAppClick = () => {
        const whatsappNumber = "+919876543210";
        const whatsappMessage = "Hi! I'm interested in learning more about Flent.";
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappUrl = `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, "")}?text=${encodedMessage}`;
        window.open(whatsappUrl, "_blank");
    };

    const getLinkHref = (link: { href: string; sectionId: string }) => {
        if (isHome && link.sectionId) {
            return `#${link.sectionId}`;
        }
        return link.href;
    };

    // Generate breadcrumbs based on path (only for hamburger variant on property detail)
    const generateBreadcrumbs = () => {
        const segments = pathname.split("/").filter((segment) => segment !== "");

        // Special handling for homes/[slug] route
        if (segments[0] === "homes" && segments.length === 2) {
            return [
                { href: "/homes", label: "Homes", isLast: false },
                {
                    href: neighborhoodName ? `/homes?location=${encodeURIComponent(neighborhoodName)}` : "/neighborhoods",
                    label: neighborhoodName || "Neighbourhoods",
                    isLast: false
                },
                {
                    href: pathname,
                    label: segments[1]
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" "),
                    isLast: true
                },
            ];
        }

        return [];
    };

    const breadcrumbs = generateBreadcrumbs();

    // Render left section based on variant and page
    const renderLeftSection = () => {
        if (variant === "secure") {
            return (
                <Button
                    variant="ghost"
                    onClick={() => router.push('/')}
                    className="bg-white rounded-full shadow-lg border border-text-main h-11 md:h-14 px-3.5 md:px-6 flex items-center pointer-events-auto hover:bg-gray-100"
                >
                    <Image
                        src="/images/flentinbengaluru.svg"
                        alt="Flent"
                        width={72}
                        height={24}
                        className="h-[18px] md:h-6 w-auto"
                        priority
                    />
                </Button>
            );
        }

        if (effectiveVariant === "hamburger" && isPropertyDetail) {
            // Property detail page with hamburger variant: Show expandable breadcrumbs
            return (
                <motion.div
                    className="flex items-center border-1 border-black bg-white rounded-full shadow-lg border h-11 md:h-14 border-text-main overflow-hidden pointer-events-auto px-2"
                    initial="collapsed"
                    whileHover="expanded"
                    variants={{
                        collapsed: { width: "auto" },
                        expanded: { width: "auto" }
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                    <Button variant="ghost" size="sm" onClick={() => router.push('/homes')}>
                        <ArrowLeft />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
                        <Image
                            src="/images/flentinbengaluru.svg"
                            alt="Flent"
                            width={60}
                            height={24}
                            className="h-[18px] md:h-6 w-auto"
                        />
                    </Button>
                    <motion.div
                        variants={{
                            collapsed: { opacity: 0, filter: "blur(10px)", width: 0, paddingRight: 0 },
                            expanded: { opacity: 1, filter: "blur(0px)", width: "auto", paddingRight: "1rem" }
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex items-center gap-2 md:gap-3 md:pr-2 whitespace-nowrap text-xs md:text-sm overflow-hidden"
                    >
                        <Breadcrumb>
                            <BreadcrumbList className="flex-nowrap">
                                {breadcrumbs.map((crumb, index) => (
                                    <React.Fragment key={crumb.href}>
                                        {index === 0 && <BreadcrumbSeparator className="flex-shrink-0" />}
                                        <BreadcrumbItem className="flex-shrink-0">
                                            {crumb.isLast ? (
                                                <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                                            ) : (
                                                <span
                                                    onClick={() => router.push(crumb.href)}
                                                    className="cursor-pointer hover:text-foreground transition-colors"
                                                >
                                                    {crumb.label}
                                                </span>
                                            )}
                                        </BreadcrumbItem>
                                        {!crumb.isLast && <BreadcrumbSeparator className="flex-shrink-0" />}
                                    </React.Fragment>
                                ))}
                            </BreadcrumbList>
                        </Breadcrumb>
                    </motion.div>
                </motion.div>
            );
        }

        if (!isHome) {
            // Non-homepage: Show back arrow + logo
            return (
                <motion.div
                    className="flex items-center bg-white rounded-full shadow-lg border h-11 md:h-14 border-text-main overflow-hidden pointer-events-auto px-2"
                    initial="collapsed"
                    whileHover="expanded"
                    variants={{
                        collapsed: { width: "auto" },
                        expanded: { width: "auto" }
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                >
                    <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
                        <ArrowLeft />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => router.push('/')}>
                        <Image
                            src="/images/flentinbengaluru.svg"
                            alt="Flent"
                            width={60}
                            height={24}
                            className="h-[18px] md:h-6 w-auto"
                        />
                    </Button>
                </motion.div>
            );
        }

        // Homepage: Simple logo
        return (
            <Button
                variant="ghost"
                onClick={() => router.push('/')}
                className="bg-white rounded-full shadow-lg border border-text-main h-11 md:h-14 px-3.5 md:px-6 flex items-center pointer-events-auto hover:bg-gray-100"
            >
                <Image
                    src="/images/flentinbengaluru.svg"
                    alt="Flent"
                    width={72}
                    height={24}
                    className="h-[18px] md:h-6 w-auto"
                    priority
                />
            </Button>
        );
    };

    const renderSecureTabs = () => {
        if (variant !== "secure" || !activeTab || !onTabChange) return null;

        return (
            <div className={cn(
                "flex items-center bg-white rounded-2xl shadow-lg border-none p-1 h-10 md:h-14 pointer-events-auto overflow-hidden transition-all duration-300",
                isOpen ? "w-0 opacity-0 pointer-events-none md:w-auto md:opacity-100 md:pointer-events-auto" : "w-auto opacity-100"
            )}>
                <Tabs value={activeTab} onValueChange={onTabChange}>
                    <TabsList className="bg-gray-100 p-1 rounded-xl h-full border-none flex items-center gap-0">
                        {['tenant', 'landlord'].map((tabValue, index) => {
                            const label = tabValue === 'tenant' ? 'Tenant' : 'Landlord';
                            const isFirst = index === 0;
                            const isLast = index === 1; // Since there are only 2 items

                            return (
                                <TabsTrigger
                                    key={tabValue}
                                    value={tabValue}
                                    className={cn(
                                        "group relative overflow-hidden px-4 md:px-7 py-1 md:py-2.5 transition-all h-full shadow-sm border border-transparent data-[state=active]:border-black/10 data-[state=active]:bg-transparent data-[state=active]:text-inherit",
                                        isFirst && "rounded-l-lg rounded-r-none border-r-0",
                                        isLast && "rounded-r-lg rounded-l-none border-l-0"
                                    )}
                                >
                                    {/* Background Animation */}
                                    <div className="absolute inset-0 bg-[#ff9a6d] translate-y-[175%] rotate-12 group-data-[state=active]:translate-y-0 group-data-[state=active]:rotate-0 transition-transform duration-500 ease-[cubic-bezier(0.625,0.05,0,1)] z-0 origin-bottom" />

                                    {/* Text Animation Container */}
                                    <div className="relative z-10 overflow-hidden block">
                                        <div className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.625,0.05,0,1)] group-data-[state=active]:-translate-y-full">
                                            {/* Default State (Black Text) */}
                                            <span className="flex items-center gap-1 text-[11px] md:text-sm font-bold font-heading tracking-wide text-black py-0.5 whitespace-nowrap">
                                                <span className="hidden md:inline">I&apos;m a&nbsp;</span>{label}
                                            </span>
                                            {/* Active State (White Text) - Positioned absolutely via flex column trick above, but let's be safer with absolute here? 
                                                Actually, flex-col with height auto and duplicate content works if container is constrained. 
                                                But standard translate up reveals next element.
                                            */}
                                            <span className="flex items-center gap-1 text-[11px] md:text-sm font-bold font-heading tracking-wide text-black py-0.5 whitespace-nowrap absolute top-full left-0 w-full">
                                                <span className="hidden md:inline">I&apos;m a&nbsp;</span>{label}
                                            </span>
                                        </div>
                                    </div>
                        </TabsTrigger>
                            );
                        })}
                    </TabsList>
                </Tabs>
            </div>
        );
    };

    // Render hamburger menu
    const renderHamburgerMenu = () => (
        <div
            ref={menuRef}
            className={cn(
                "relative pointer-events-auto",
                // For expanded variant, hide hamburger on desktop (lg+)
                showExpandedNav && "lg:hidden"
            )}
            onMouseEnter={() => canHover && setIsHovered(true)}
            onMouseLeave={() => canHover && setIsHovered(false)}
        >
            <div className="absolute -inset-4 bg-transparent z-[-1]" />
            <motion.div
                className="bg-white shadow-lg border border-text-main flex flex-col items-start overflow-hidden"
                initial="collapsed"
                variants={{
                    collapsed: {
                        height: typeof window !== 'undefined' && window.innerWidth < 768 ? 44 : 56,
                        width: typeof window !== 'undefined' && window.innerWidth < 768 ? 44 : 56,
                        borderRadius: '100%'
                    },
                    expanded: { height: 'auto', width: 220, borderRadius: '12%' }
                }}
                animate={isOpen || isHovered ? "expanded" : "collapsed"}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
            >
                <div className="flex flex-col items-stretch w-full">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            "flex items-center justify-center h-11 md:h-14 flex-shrink-0",
                            canHover && "pointer-events-none"
                        )}
                    >
                        <Menu className="w-6 h-6 md:w-7 md:h-7 text-text-main" />
                    </button>
                    <motion.div
                        variants={{
                            collapsed: { opacity: 0, height: 0 },
                            expanded: { opacity: 1, height: "auto" }
                        }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="flex flex-col gap-2 px-3 md:px-4 pb-3 md:pb-4"
                    >
                        {defaultNavLinks.map((link) => (
                            <Button
                                key={link.name}
                                variant="ghost"
                                size="sm"
                                className="w-full"
                                disabled={!link.href}
                                onClick={(e) => {
                                    if (link.href) {
                                        if (!isHome && link.sectionId) {
                                            e.preventDefault();
                                            router.push(`/#${link.sectionId}`);
                                        } else {
                                            router.push(getLinkHref(link));
                                        }
                                        setIsOpen(false);
                                    }
                                }}
                                style={!link.href ? { opacity: 0.5, cursor: 'default' } : undefined}
                            >
                                {link.name}
                            </Button>
                        ))}
                        <div className="flex flex-col gap-2">
                            <Button
                                className="w-full"
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    router.push('/about');
                                    setIsOpen(false);
                                }}
                            >
                                Our Story
                            </Button>
                            <Button
                                href={WHATSAPP_LINK}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full"
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    handleWhatsAppClick();
                                    setIsOpen(false);
                                }}
                            >
                                Contact Us
                            </Button>
                            <Button
                                className="w-full"
                                size="sm"
                                variant="primary-rounded"
                                pastelColor="violet"
                                onClick={() => {
                                    router.push('/owners');
                                    setIsOpen(false);
                                }}
                            >
                                For Owners
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );

    // Render expanded nav (desktop only, for expanded variant)
    const renderExpandedNav = () => {
        if (!showExpandedNav) return null;

        return (
            <div className="hidden lg:flex items-center gap-3 bg-white rounded-full shadow-lg border border-text-main h-14 px-3 pointer-events-auto">
                <Button variant="ghost" size="sm" onClick={() => router.push('/homes')}>
                    All Homes
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full" onClick={() => router.push('/about')}>
                    Our Story
                </Button>
                <Button
                    variant="primary"
                    size="sm"
                    pastelColor="violet"
                    className="rounded-full"
                    onClick={() => router.push('/owners')}
                    rightIcon={<ArrowRight />}
                >
                    For Owners
                </Button>
            </div>
        );
    };

    return (
        <nav className={cn(
            "fixed top-[var(--top-banner-height,0px)] left-0 right-0 z-50 pt-3.5 md:pt-6 pb-2 pointer-events-none transition-[top] duration-200",
            variant === "secure" ? "px-4 md:px-8 lg:px-12" : "px-3 sm:px-4 md:px-6 lg:px-8"
        )}>
            <div className={cn(
                "mx-auto flex items-start justify-between h-16 md:h-20",
                variant === "secure" ? "max-w-7xl" : "max-w-12xl"
            )}>
                {renderLeftSection()}

                <div className="flex justify-end gap-2 md:gap-3 items-start">
                    {renderSecureTabs()}
                    {renderExpandedNav()}
                    {renderHamburgerMenu()}
                </div>
            </div>
        </nav>
    );
};

