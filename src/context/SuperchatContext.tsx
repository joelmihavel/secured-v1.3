"use client";

import React, { createContext, useCallback, useContext, useState } from "react";
import type { SuperchatPageType } from "@/constants";

interface SuperchatContextValue {
  propertyName: string | null;
  pageType: SuperchatPageType;
  setPropertyContext: (propertyName: string | null) => void;
  setPageType: (pageType: SuperchatPageType) => void;
}

const SuperchatContext = createContext<SuperchatContextValue | null>(null);

export function SuperchatProvider({ children }: { children: React.ReactNode }) {
  const [propertyName, setPropertyName] = useState<string | null>(null);
  const [pageType, setPageTypeState] = useState<SuperchatPageType>("default");

  const setPropertyContext = useCallback((name: string | null) => {
    setPropertyName(name);
  }, []);

  const setPageType = useCallback((type: SuperchatPageType) => {
    setPageTypeState(type);
  }, []);

  return (
    <SuperchatContext.Provider
      value={{ propertyName, pageType, setPropertyContext, setPageType }}
    >
      {children}
    </SuperchatContext.Provider>
  );
}

export function useSuperchatContext() {
  const ctx = useContext(SuperchatContext);
  return ctx;
}

/**
 * Client component to set the current property name for the Superchat widget.
 * Render once per homes/[slug] page with propertyName={property.fieldData.name}.
 * On unmount (navigate away) context is cleared.
 */
export function PropertyChatContextSetter({
  propertyName,
}: {
  propertyName: string;
}) {
  const { setPropertyContext, setPageType } = useSuperchatContext() ?? {};
  React.useEffect(() => {
    setPropertyContext?.(propertyName);
    setPageType?.("property");
    return () => {
      setPropertyContext?.(null);
      setPageType?.("default");
    };
  }, [propertyName, setPropertyContext, setPageType]);
  return null;
}

/**
 * Client component to set page type for owners page.
 * Render once on /owners page.
 * On unmount (navigate away) context is reset to default.
 */
export function OwnersChatContextSetter() {
  const { setPageType } = useSuperchatContext() ?? {};
  React.useEffect(() => {
    setPageType?.("owners");
    return () => setPageType?.("default");
  }, [setPageType]);
  return null;
}
