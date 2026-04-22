"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import LoadingScreen from "@/components/loader/LoadingScreen";
import NavBar from "@/components/nav/NavBar";
import SmoothScroll from "@/components/providers/SmoothScroll";
import AnimatedCursor from "@/components/cursor/AnimatedCursor";
import CursorTrail from "@/components/cursor/CursorTrail";
import { CursorProvider } from "@/components/cursor/CursorContext";
import AchievementToast from "@/components/common/AchievementToast";

interface AppReadyContextValue {
  ready: boolean;
}

const AppReadyContext = createContext<AppReadyContextValue>({ ready: false });

export function useAppReady() {
  return useContext(AppReadyContext);
}

/**
 * Top-level client shell:
 *  - Runs the (session-gated) LoadingScreen and exposes a `ready` flag.
 *  - Locks body scroll while the loader is visible.
 *  - Mounts Lenis smooth-scroll, AnimatedCursor, and NavBar globally — all
 *    deferred until the loader completes so they don't flash during intro.
 */
export default function AppShell({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = ready ? "" : "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [ready]);

  const value = useMemo(() => ({ ready }), [ready]);

  return (
    <AppReadyContext.Provider value={value}>
      <CursorProvider>
        <LoadingScreen onComplete={() => setReady(true)} />
        {ready && <SmoothScroll />}
        {ready && <NavBar />}
        {ready && <CursorTrail />}
        {ready && <AchievementToast />}
        <AnimatedCursor />
        {children}
      </CursorProvider>
    </AppReadyContext.Provider>
  );
}
