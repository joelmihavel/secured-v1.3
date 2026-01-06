"use client";
import React from "react";
import Link from "next/link";

export const SecureFooter = () => {
    return (
        <footer className="w-full">
            {/* Black Stats Section - matching GetStarted.tsx dark background */}
            <div className="bg-[#121212] text-white py-12 md:py-16 px-6 md:px-12 lg:px-16 relative overflow-hidden">
                {/* Subtle gradient overlay like GetStarted */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none" />

                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Heading */}
                    <p className="text-brand-orange text-sm md:text-base font-medium mb-8 md:mb-12">
                        Curating India's Top 1% Rental Homes
                    </p>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-0">
                        {/* Stat 1 */}
                        <div className="md:border-r border-white/10 md:pr-12">
                            <p className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold mb-2">150+</p>
                            <p className="text-sm md:text-base text-white/60">Apartments in Bangalore</p>
                        </div>

                        {/* Stat 2 */}
                        <div className="md:border-r border-white/10 md:px-12">
                            <p className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold mb-2">4.8/5</p>
                            <p className="text-sm md:text-base text-white/60">Avg. Rating from Residents</p>
                        </div>

                        {/* Stat 3 */}
                        <div className="md:pl-12">
                            <p className="text-4xl md:text-5xl lg:text-6xl font-heading font-semibold mb-2">INR 27 Cr</p>
                            <p className="text-sm md:text-base text-white/60">Raised since inception</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Orange Footer Section */}
            <div className="bg-brand-orange py-12 md:py-16 px-6 md:px-12 lg:px-16 text-text-main relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
                        {/* Left Column */}
                        <div>
                            {/* Logo and Title */}
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-7 h-7 rounded-full bg-text-main text-white flex items-center justify-center font-bold text-[10px]">F</div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-main/60">FLENT SECURE</p>
                            </div>

                            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading leading-[1.05] tracking-tight">
                                Welcome To The <br /> <span className="font-zin-italic">Right Side</span> of Renting.
                            </h2>
                        </div>

                        {/* Right Column - Links */}
                        <div className="flex flex-col items-start md:items-end text-left md:text-right">
                            <nav className="flex flex-col items-start md:items-end gap-2">
                                <Link
                                    href="/explore"
                                    className="text-xl md:text-2xl font-heading font-medium hover:opacity-70 transition-opacity"
                                >
                                    Explore
                                </Link>
                                <Link
                                    href="/contact"
                                    className="text-xl md:text-2xl font-heading font-medium hover:opacity-70 transition-opacity"
                                >
                                    Contact
                                </Link>
                            </nav>
                        </div>
                    </div>

                    {/* Bottom Row - Built with love & Copyright */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pt-6 border-t border-text-main/10">
                        {/* Built with love */}
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-text-main/80">Built with love <span className="text-brick-red">♥</span></span>
                            <div className="h-px bg-text-main/30 w-16 md:w-24"></div>
                            <span className="text-sm text-text-main/80">by <span className="font-zin-italic text-base">flent</span></span>
                        </div>

                        {/* Copyright */}
                        <p className="text-[10px] font-medium uppercase tracking-widest text-text-main/50">
                            © {new Date().getFullYear()} FLENT. ALL RIGHTS RESERVED.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};
