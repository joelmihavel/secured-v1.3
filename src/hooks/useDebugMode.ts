"use client";

import { useState, useEffect } from "react";

const DEBUG_STORAGE_KEY = "flent_debug_mode";

export function useDebugMode(): boolean {
  const [isDebugMode, setIsDebugMode] = useState(false);

  useEffect(() => {
    // Check URL param first
    const urlParams = new URLSearchParams(window.location.search);
    const debugParam = urlParams.get("debugFlent");

    if (debugParam === "deep") {
      // Activate debug mode and persist to localStorage
      localStorage.setItem(DEBUG_STORAGE_KEY, "true");
      setIsDebugMode(true);
    } else if (debugParam === "off") {
      // Explicitly disable debug mode
      localStorage.removeItem(DEBUG_STORAGE_KEY);
      setIsDebugMode(false);
    } else {
      // Check localStorage for persisted debug mode
      const stored = localStorage.getItem(DEBUG_STORAGE_KEY);
      setIsDebugMode(stored === "true");
    }
  }, []);

  return isDebugMode;
}
