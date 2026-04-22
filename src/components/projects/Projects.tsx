"use client";

import { useCallback, useState } from "react";
import { PROJECTS, type Project } from "./data";
import ProjectsHeader from "./ProjectsHeader";
import ProjectModal from "./ProjectModal";
import AuraFeaturedCard from "./cards/AuraFeaturedCard";
import ProjectCard from "./cards/ProjectCard";
import EcgChart from "./visuals/EcgChart";
import MiningBarChart from "./visuals/MiningBarChart";
import RagFlowDiagram from "./visuals/RagFlowDiagram";

/**
 * Projects section — the "What I've Built" band.
 *
 *  [flagship AURA card — full width, 500px, live simulation]
 *  [VLEED]  [Wathba]
 *  [RAG]    (+ space for future projects in the 2-col grid)
 */
export default function Projects() {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);

  const open = useCallback((slug: string) => setActiveSlug(slug), []);
  const close = useCallback(() => setActiveSlug(null), []);

  const featured = PROJECTS.find((p) => p.slug === "aura");
  const rest = PROJECTS.filter((p) => p.slug !== "aura");

  const activeProject: Project | null =
    PROJECTS.find((p) => p.slug === activeSlug) ?? null;

  return (
    <section
      id="projects"
      aria-label="Selected projects"
      className="relative isolate overflow-hidden border-t border-white/5 py-28 md:py-36"
    >
      {/* Background decor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-30 grid-bg mask-radial-fade"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 right-20 h-[420px] w-[420px] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,53,0.3), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-10 left-20 h-[420px] w-[420px] rounded-full opacity-25 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(123,47,190,0.35), transparent 70%)",
        }}
      />

      <div className="container-page relative flex flex-col gap-16">
        <ProjectsHeader />

        {/* Featured */}
        {featured && (
          <AuraFeaturedCard project={featured} onOpen={() => open(featured.slug)} />
        )}

        {/* Grid of remaining projects */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {rest.map((p, i) => (
            <ProjectCard
              key={p.slug}
              project={p}
              index={i}
              onOpen={() => open(p.slug)}
            >
              {renderVisualFor(p.slug)}
            </ProjectCard>
          ))}
        </div>
      </div>

      {/* Drawer */}
      <ProjectModal project={activeProject} onClose={close} />
    </section>
  );
}

/** Visual dispatch — each project has a bespoke animated surface. */
function renderVisualFor(slug: string) {
  switch (slug) {
    case "vleed":
      return <EcgChart />;
    case "wathba":
      return <MiningBarChart />;
    case "rag":
      return <RagFlowDiagram />;
    default:
      return null;
  }
}
