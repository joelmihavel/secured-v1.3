"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X, ChevronLeft, ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumb } from "@/context/BreadcrumbContext";
import { cn } from "@/lib/utils";

const defaultNavLinks = [
    { name: "Find Your Home", href: "/homes", sectionId: "" },
    { name: "Secured", href: "", sectionId: "" },
];

interface NavbarProps {
    showDesktopNav?: boolean;
}


export const Navbar = ({ showDesktopNav = false }: NavbarProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [canHover, setCanHover] = useState(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(hover: hover)");
        setCanHover(mediaQuery.matches);

        const handler = (e: MediaQueryListEvent) => setCanHover(e.matches);
        mediaQuery.addEventListener("change", handler);
        return () => mediaQuery.removeEventListener("change", handler);
    }, []);
    const pathname = usePathname();
    const router = useRouter();
    const isHome = pathname === "/";
    const { neighborhoodName, neighborhoodId } = useBreadcrumb();

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

    // Generate breadcrumbs based on path
    const generateBreadcrumbs = () => {
        const segments = pathname.split("/").filter((segment) => segment !== "");

        // Special handling for homes/[slug] route
        if (segments[0] === "homes" && segments.length === 2) {
            return [
                { href: "/homes", label: "Homes", isLast: false },
                {
                    href: neighborhoodId ? `/homes?locationId=${neighborhoodId}` : "/neighborhoods",
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

        // Default breadcrumb generation for other routes
        const breadcrumbs = segments.map((segment, index) => {
            const href = `/${segments.slice(0, index + 1).join("/")}`;
            const isLast = index === segments.length - 1;

            // Format segment for display (capitalize, replace hyphens)
            const label = segment
                .split("-")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");

            return { href, label, isLast };
        });

        return breadcrumbs;
    };

    const breadcrumbs = generateBreadcrumbs();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 md:px-6 lg:px-8 pt-3.5 md:pt-6 pb-2 pointer-events-none">
            <div className="max-w-12xl mx-auto flex items-start justify-between h-16 md:h-20">
                {/* Left Section: Logo or Breadcrumbs - Always Visible */}
                {pathname.startsWith('/homes/') && pathname.split('/').length === 3 ? (
                    // Property detail page: Show expandable breadcrumbs
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
                        {/* Back Arrow */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/homes')}

                        >
                            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 text-text-main" />
                        </Button>

                        {/* Flent Logo */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/')}

                        >
                            <Image
                                src="/images/flentinbengaluru.svg"
                                alt="Flent"
                                width={60}
                                height={24}
                                className="h-[18px] md:h-6 w-auto"
                            />
                        </Button>

                        {/* Breadcrumbs (Hidden by default, shown on hover) */}
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
                ) : pathname !== '/' ? (
                    // Homes & About pages: Show back arrow + logo (no breadcrumbs)
                    <motion.div
                        className="flex items-center bg-white rounded-full shadow-lg border h-11 md:h-14 border-text-main overflow-hidden pointer-events-auto px-2"
                        initial="collapsed"
                        whileHover="expanded"
                        variants={{
                            collapsed: { width: "auto" },
                            expanded: { width: "auto" } // No expansion needed
                        }}
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    >
                        {/* Back Arrow */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/')}

                        >
                            <ArrowLeft />
                        </Button>

                        {/* Flent Logo */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push('/')}

                        >
                            <Image
                                src="/images/flentinbengaluru.svg"
                                alt="Flent"
                                width={60}
                                height={24}
                                className="h-[18px] md:h-6 w-auto"
                            />
                        </Button>
                    </motion.div>
                ) : (
                    // All other pages (Homepage): Simple logo
                    <Button
                        variant="ghost"
                        onClick={() => router.push('/')}
                        className=" bg-white rounded-full shadow-lg border border-text-main h-11 md:h-14 px-3.5 md:px-6 flex items-center pointer-events-auto hover:bg-gray-100"
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
                )}

                <div className="flex justify-end gap-2 md:gap-3 items-start">
                    {/* Desktop Horizontal Nav - Only shown on homepage desktop */}
                    {(isHome || showDesktopNav) && (
                        <div className="hidden lg:flex items-center gap-3 bg-white rounded-full shadow-lg border border-text-main h-14 px-3 pointer-events-auto">
                            {/* Find Your Home */}
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push('/homes')}
                            >
                                Find Your Home
                            </Button>

                            {/* Secured - disabled */}
                            <Button
                                variant="ghost"
                                size="sm"
                                disabled
                                style={{ opacity: 0.5, cursor: 'default' }}
                            >
                                Secured
                            </Button>

                            {/* Our Story - secondary with pastel */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="rounded-full"
                                onClick={() => router.push('/about')}
                            >
                                Our Story
                            </Button>

                            {/* For Owners - secondary default */}
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

                            {/* Contact Us - primary
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={handleWhatsAppClick}
                            >
                                Contact Us
                            </Button> */}
                        </div>
                    )}

                    {/* CTA Button - Hidden on mobile and property detail pages, also hidden when showDesktopNav is true */}
                    {!(pathname.startsWith('/homes/') && pathname.split('/').length === 3) && !(isHome || showDesktopNav) && (
                        <div className="hidden md:flex items-center pointer-events-auto">
                            <Button
                                variant="primary"
                                size="md"
                                onClick={handleWhatsAppClick}
                            >
                                Chat with us
                            </Button>
                        </div>
                    )}

                    {/* Hamburger Menu - Always shown on mobile, hidden on desktop when showDesktopNav is true */}
                    <div
                        className={cn(
                            "relative pointer-events-auto",
                            (isHome || showDesktopNav) && "lg:hidden"
                        )}
                        onMouseEnter={() => canHover && setIsHovered(true)}
                        onMouseLeave={() => canHover && setIsHovered(false)}
                    >
                        {/* Safe area buffer */}
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
                            {/* Menu Icon and Nav Items (works for all screen sizes) */}
                            <div className="flex flex-col items-stretch w-full">
                                {/* Menu Icon (always visible) */}
                                <button
                                    onClick={() => setIsOpen(!isOpen)}
                                    className={cn(
                                        "flex items-center justify-center h-11 md:h-14 flex-shrink-0",
                                        canHover && "pointer-events-none"
                                    )}
                                >
                                    <Menu className="w-6 h-6 md:w-7 md:h-7 text-text-main" />
                                </button>

                                {/* Navigation Links (shown when expanded) */}
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
                                    <div className="pt-2 flex flex-col gap-2">
                                        <Button
                                            className="w-full"
                                            size="sm"
                                            variant="primary"
                                            onClick={() => {
                                                router.push('/about');
                                                setIsOpen(false);
                                            }}
                                        >
                                            Our Story
                                        </Button>
                                        <Button
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
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

