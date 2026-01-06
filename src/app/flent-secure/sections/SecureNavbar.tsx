"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SecureNavbarProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export const SecureNavbar = ({ activeTab, onTabChange }: SecureNavbarProps) => {
    return (
        <nav className="w-full py-6 flex justify-between items-center px-4 md:px-12 bg-white sticky top-0 z-50 border-b border-gray-100">
            <Link href="/">
                <Image
                    src="/images/flentinbengaluru.svg"
                    alt="Flent"
                    width={80}
                    height={40}
                    className="h-8 md:h-10 w-auto"
                />
            </Link>

            <Tabs value={activeTab} onValueChange={onTabChange}>
                <TabsList className="bg-gray-100 p-1 rounded-full">
                    <TabsTrigger
                        value="tenant"
                        className="rounded-full px-6 py-2 data-[state=active]:bg-black data-[state=active]:text-white transition-all text-sm font-medium"
                    >
                        For Tenant
                    </TabsTrigger>
                    <TabsTrigger
                        value="landlord"
                        className="rounded-full px-6 py-2 data-[state=active]:bg-black data-[state=active]:text-white transition-all text-sm font-medium"
                    >
                        For Landlord
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </nav>
    );
};
