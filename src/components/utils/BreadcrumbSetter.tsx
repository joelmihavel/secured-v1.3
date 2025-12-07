"use client";

import { useEffect } from "react";
import { useBreadcrumb } from "@/context/BreadcrumbContext";

interface BreadcrumbSetterProps {
    neighborhoodName: string;
    neighborhoodId: string;
}

export const BreadcrumbSetter = ({ neighborhoodName, neighborhoodId }: BreadcrumbSetterProps) => {
    const { setNeighborhoodInfo } = useBreadcrumb();

    useEffect(() => {
        setNeighborhoodInfo(neighborhoodName, neighborhoodId);

        // Cleanup when unmounting (leaving the page)
        return () => {
            setNeighborhoodInfo(null, null);
        };
    }, [neighborhoodName, neighborhoodId, setNeighborhoodInfo]);

    return null;
};
