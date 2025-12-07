"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface BreadcrumbContextType {
    neighborhoodName: string | null;
    neighborhoodId: string | null;
    setNeighborhoodInfo: (name: string | null, id: string | null) => void;
}

const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(undefined);

export const BreadcrumbProvider = ({ children }: { children: ReactNode }) => {
    const [neighborhoodName, setNeighborhoodName] = useState<string | null>(null);
    const [neighborhoodId, setNeighborhoodId] = useState<string | null>(null);

    const setNeighborhoodInfo = (name: string | null, id: string | null) => {
        setNeighborhoodName(name);
        setNeighborhoodId(id);
    };

    return (
        <BreadcrumbContext.Provider value={{ neighborhoodName, neighborhoodId, setNeighborhoodInfo }}>
            {children}
        </BreadcrumbContext.Provider>
    );
};

export const useBreadcrumb = () => {
    const context = useContext(BreadcrumbContext);
    if (context === undefined) {
        throw new Error("useBreadcrumb must be used within a BreadcrumbProvider");
    }
    return context;
};
