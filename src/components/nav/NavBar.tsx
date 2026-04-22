"use client";

import BackToTop from "./BackToTop";
import Nav from "./Nav";
import ScrollProgress from "./ScrollProgress";
import SectionIndicators from "./SectionIndicators";

/**
 * Combines the four nav-related floating elements:
 *   - Top scroll progress line
 *   - Main navigation bar (desktop + mobile)
 *   - Right-edge section dot indicators (lg+ only)
 *   - Bottom-right "Back to top" FAB
 *
 * Mounted from AppShell after the loader finishes so these controls don't
 * appear during the intro sequence.
 */
export default function NavBar() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <SectionIndicators />
      <BackToTop />
    </>
  );
}
