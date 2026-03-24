"use client";

import { useEffect } from "react";
import { useCurrentBusiness } from "@/firebase";

/**
 * ThemeHydrator syncs the currentBusinessId with the document's data-theme attribute.
 * This allows global CSS variables to react to the selected business.
 */
export function ThemeHydrator() {
  const { currentBusinessId } = useCurrentBusiness();

  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      if (currentBusinessId === "elevated-adventures") {
        root.setAttribute("data-theme", "elevated-adventures");
      } else if (currentBusinessId === "wands-ledgers") {
        root.setAttribute("data-theme", "wands-ledgers");
      } else {
        root.removeAttribute("data-theme");
      }
    }
  }, [currentBusinessId]);

  return null;
}