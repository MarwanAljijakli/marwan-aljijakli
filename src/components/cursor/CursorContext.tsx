"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

export type CursorVariant =
  | "default"   // small dot + thin ring
  | "link"      // expand: larger ring, faded dot — used over anchors/interactive links
  | "button"    // compress: no ring, solid dot — used over buttons/CTAs
  | "text"      // i-beam / reading mode — used over paragraphs
  | "three"     // crosshair — used over 3D canvas sections
  | "hidden";   // fully hidden (e.g. forms/native inputs)

interface CursorContextValue {
  variant: CursorVariant;
  label: string | null;
  setVariant: (v: CursorVariant) => void;
  setLabel: (label: string | null) => void;
  reset: () => void;
}

const CursorContext = createContext<CursorContextValue | null>(null);

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [label, setLabel] = useState<string | null>(null);

  const reset = useCallback(() => {
    setVariant("default");
    setLabel(null);
  }, []);

  const value = useMemo(
    () => ({ variant, label, setVariant, setLabel, reset }),
    [variant, label, reset]
  );

  return <CursorContext.Provider value={value}>{children}</CursorContext.Provider>;
}

export function useCursor() {
  const ctx = useContext(CursorContext);
  if (!ctx) {
    // Non-throwing fallback so the app still renders without a provider.
    return {
      variant: "default" as CursorVariant,
      label: null,
      setVariant: () => {},
      setLabel: () => {},
      reset: () => {},
    };
  }
  return ctx;
}

/**
 * Helper props to attach to any element to drive the cursor on hover.
 *
 *   <a {...cursorHover("link", "View project")}>…</a>
 */
export function cursorHover(variant: CursorVariant, label?: string) {
  return {
    "data-cursor": variant,
    "data-cursor-label": label,
  } as const;
}
