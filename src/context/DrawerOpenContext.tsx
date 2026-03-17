"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface DrawerOpenContextType {
  isDrawerOpen: boolean;
  setDrawerOpen: (open: boolean) => void;
}

const DrawerOpenContext = createContext<DrawerOpenContextType | null>(null);

const noop = () => {};

export function DrawerOpenProvider({ children }: { children: ReactNode }) {
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  return (
    <DrawerOpenContext.Provider value={{ isDrawerOpen, setDrawerOpen }}>
      {children}
    </DrawerOpenContext.Provider>
  );
}

export function useOptionalDrawerOpen(): DrawerOpenContextType | null {
  return useContext(DrawerOpenContext);
}

export function useDrawerOpen(): DrawerOpenContextType {
  const context = useOptionalDrawerOpen();
  if (!context) {
    if (process.env.NODE_ENV === "development") {
      throw new Error(
        "useDrawerOpen must be used within a <DrawerOpenProvider>."
      );
    }
    return { isDrawerOpen: false, setDrawerOpen: noop };
  }
  return context;
}
