"use client";
import React from "react";
import Link from "next/link";

export const SecureFooter = () => {
    return (
        <footer className="w-full">
            {/* Black Stats Section with Image Grid */}
            <div className="bg-[#121212] text-white py-12 md:py-16 lg:py-20 px-4 md:px-8 lg:px-12 relative overflow-hidden">
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Main 3-Column Grid Layout */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_1.2fr] gap-8 lg:gap-12 items-start">

                        {/* Left Column - Branding */}
                        <div className="flex flex-col gap-4">
                            {/* Built with love */}
                            <h3 className="text-fluid-h3 font-zin font-extrabold text-white leading-tight">
                                Built with love <span className="text-brand-orange">🧡</span> <span className="text-white/60 text-lg md:text-xl lg:text-2xl font-body">by</span> <span className="font-zin-italic text-2xl md:text-3xl">flent</span>
                            </h3>

                            {/* Tagline */}
                            <p className="text-white/50 text-sm md:text-base font-body">
                                Curating India's Top 1% Rental Homes
                            </p>
                        </div>

                        {/* Middle Column - Stats */}
                        <div className="flex flex-col gap-6 md:gap-8">
                            {/* Stat 1 */}
                            <div>
                                <p className="text-fluid-h2 font-zin font-extrabold text-white mb-1">150+</p>
                                <p className="text-subtitle-sm text-white/50 font-body">Apartments in Bangalore</p>
                            </div>

                            {/* Stat 2 */}
                            <div>
                                <p className="text-fluid-h2 font-zin font-extrabold text-white mb-1">4.8/5</p>
                                <p className="text-subtitle-sm text-white/50 font-body">Avg. Rating from Residents</p>
                            </div>

                            {/* Stat 3 */}
                            <div>
                                <p className="text-fluid-h2 font-zin font-extrabold text-white mb-1">INR 21 Cr</p>
                                <p className="text-subtitle-sm text-white/50 font-body">Raised since inception</p>
                            </div>
                        </div>

                        {/* Right Column - Image Grid */}
                        <div className="relative hidden md:block">
                            {/* Gradient fade overlay - left to right */}
                            <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-[#121212]/60 to-transparent z-10 pointer-events-none" />

                            {/* 2x2 Image Grid */}
                            <div className="grid grid-cols-2 gap-2 md:gap-3">
                                <div className="aspect-[4/3] rounded-lg overflow-hidden">
                                    <img
                                        src="/banner-images/Banner (3).webp"
                                        alt="Flent Home"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="aspect-[4/3] rounded-lg overflow-hidden">
                                    <img
                                        src="/banner-images/DSC03105-HDR.webp"
                                        alt="Flent Home"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="aspect-[4/3] rounded-lg overflow-hidden">
                                    <img
                                        src="/banner-images/DSC06369-HDR (2).webp"
                                        alt="Flent Home"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="aspect-[4/3] rounded-lg overflow-hidden">
                                    <img
                                        src="/banner-images/DSC04699-HDR (4).webp"
                                        alt="Flent Home"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Image Grid - Single Row */}
                    <div className="md:hidden mt-8 relative">
                        {/* Gradient fade overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-[#121212] via-transparent to-transparent z-10 pointer-events-none" />

                        <div className="grid grid-cols-2 gap-2">
                            <div className="aspect-[4/3] rounded-lg overflow-hidden">
                                <img
                                    src="/banner-images/Banner (3).webp"
                                    alt="Flent Home"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="aspect-[4/3] rounded-lg overflow-hidden">
                                <img
                                    src="/banner-images/DSC03105-HDR.webp"
                                    alt="Flent Home"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orange Footer Section */}
            <div className="bg-brand-orange py-12 md:py-20 lg:py-24 px-4 md:px-8 lg:px-12 text-text-main relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-12 items-center">
                        {/* Left Column */}
                        <div className="flex flex-col gap-8 md:gap-12">
                            {/* Logo */}
                            <div>
                                <img
                                    src="/secure-lotties/AppDownloadAssets/AppDownload_FlentLogo.png"
                                    alt="Flent Secure Logo"
                                    className="h-8 md:h-10 lg:h-12 w-auto object-contain"
                                />
                            </div>

                            <h2 className="text-hero-h1 font-zin font-extrabold leading-[1] tracking-tight max-w-4xl">
                                Welcome To The <br className="hidden md:block" /> Right Side of Renting
                            </h2>
                        </div>

                        {/* Right Column - Links */}
                        <div className="flex flex-col gap-6 md:gap-8 text-left md:text-right">
                            <Link
                                href="https://www.flent.in/"
                                className="text-fluid-h3 font-body font-medium hover:opacity-70 transition-opacity"
                            >
                                Explore
                            </Link>
                            <Link
                                href="https://wa.me/918904695925?text=Curious+to+know+more+about+Flent%E2%80%94tell+me+everything%21+%5BWAX-UK6N%5D"
                                className="text-fluid-h3 font-body font-medium hover:opacity-70 transition-opacity"
                            >
                                Contact
                            </Link>
                        </div>
                    </div>

                    {/* Bottom Row - Copyright Only */}
                    <div className="flex justify-center items-center mt-16 md:mt-24 pt-8 border-t border-text-main/10">
                        {/* Copyright */}
                        <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-main/50 font-body">
                            © {new Date().getFullYear()} FLENT. ALL RIGHTS RESERVED.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
