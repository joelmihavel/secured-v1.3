"use client";

import React from "react";
import { IconSearch as Search, IconCalendar as Calendar, IconChevronDown as ChevronDown } from "@tabler/icons-react";
import { Location } from "@/lib/webflow";

export interface SearchFilters {
    minBudget: number;
    maxBudget: number;
    locationId: string;
    moveInDate: string;
    showAvailable: boolean;
}

interface SearchBarProps {
    locations: Location[];
    filters: SearchFilters;
    setFilters: (filters: SearchFilters) => void;
}

export const SearchBar = ({ locations, filters, setFilters }: SearchBarProps) => {
    const handleBudgetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        let min = 0;
        let max = Infinity;

        if (value === "25-35") { min = 25000; max = 35000; }
        else if (value === "35-45") { min = 35000; max = 45000; }
        else if (value === "45+") { min = 45000; }

        setFilters({ ...filters, minBudget: min, maxBudget: max });
    };

    return (
        <div className="w-full bg-night-violet rounded-2xl p-6 flex flex-col lg:flex-row items-center gap-4 lg:gap-6 shadow-lg">
            {/* Budget Range */}
            <div className="flex-1 w-full">
                <label className="block text-text-invert text-sm font-medium mb-2">Budget Range</label>
                <div className="relative">
                    <select
                        onChange={handleBudgetChange}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-text-invert placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none cursor-pointer"
                    >
                        <option value="all" className="text-black">Any Budget</option>
                        <option value="25-35" className="text-black">₹25,000 - ₹35,000</option>
                        <option value="35-45" className="text-black">₹35,000 - ₹45,000</option>
                        <option value="45+" className="text-black">₹45,000+</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={16} />
                </div>
            </div>

            {/* Preferred Location */}
            <div className="flex-1 w-full">
                <label className="block text-text-invert text-sm font-medium mb-2">Preferred Location</label>
                <div className="relative">
                    <select
                        value={filters.locationId}
                        onChange={(e) => setFilters({ ...filters, locationId: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-text-invert placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none cursor-pointer"
                    >
                        <option value="" className="text-black">All Locations</option>
                        {locations.map((loc) => (
                            <option key={loc.id} value={loc.id} className="text-black">
                                {loc.fieldData.name}
                            </option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={16} />
                </div>
            </div>

            {/* Move-In Date */}
            <div className="flex-1 w-full">
                <label className="block text-text-invert text-sm font-medium mb-2">Move-In Date</label>
                <div className="relative">
                    <input
                        type="date"
                        value={filters.moveInDate}
                        onChange={(e) => setFilters({ ...filters, moveInDate: e.target.value })}
                        className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-text-invert placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 pointer-events-none" size={16} />
                </div>
            </div>

            {/* Show Available & Search */}
            <div className="flex items-center gap-4 mt-4 lg:mt-0">
                <div
                    className="flex items-center gap-2 bg-white rounded-full px-4 py-2 cursor-pointer select-none"
                    onClick={() => setFilters({ ...filters, showAvailable: !filters.showAvailable })}
                >
                    <div className="relative inline-flex items-center">
                        <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={filters.showAvailable}
                            readOnly
                        />
                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-night-violet"></div>
                    </div>
                    <span className="text-text-main text-sm font-medium whitespace-nowrap">Show Available</span>
                </div>

                <button className="bg-white text-text-main p-3 rounded-full hover:scale-105 transition-transform">
                    <Search size={20} />
                </button>
            </div>
        </div>
    );
};
