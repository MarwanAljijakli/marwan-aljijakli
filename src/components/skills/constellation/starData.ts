export type StarCategory =
  | "core"
  | "ai"
  | "cv"
  | "devops"
  | "data"
  | "frontend";

export interface StarCategoryDef {
  label: string;
  color: string; // hex
}

export const CATEGORIES: Record<StarCategory, StarCategoryDef> = {
  core: { label: "Core", color: "#BFF7FF" },
  ai: { label: "AI / ML", color: "#00D4FF" },
  cv: { label: "Computer Vision", color: "#10dc78" },
  devops: { label: "DevOps", color: "#FF6B35" },
  data: { label: "Data", color: "#7B2FBE" },
  frontend: { label: "Frontend", color: "#fcc44e" },
};

export interface Star {
  name: string;
  category: StarCategory;
  ring: 0 | 1 | 2 | 3;
  angle: number; // radians around Y axis
  yOffset: number;
  size: number;
  description: string;
}

const RING_RADIUS = [0, 2.0, 3.6, 5.1] as const;

export function positionFor(
  star: Star
): [number, number, number] {
  const r = RING_RADIUS[star.ring];
  return [Math.cos(star.angle) * r, star.yOffset, Math.sin(star.angle) * r];
}

export const STARS: Star[] = [
  {
    name: "Python",
    category: "core",
    ring: 0,
    angle: 0,
    yOffset: 0,
    size: 0.36,
    description: "Primary language · end-to-end",
  },

  /* -- Ring 1 — foundational frameworks -------------------------------- */
  {
    name: "PyTorch",
    category: "ai",
    ring: 1,
    angle: 0.2,
    yOffset: 0.25,
    size: 0.2,
    description: "Model training · research-to-prod",
  },
  {
    name: "TensorFlow",
    category: "ai",
    ring: 1,
    angle: Math.PI * 0.55,
    yOffset: -0.2,
    size: 0.2,
    description: "Production inference · serving",
  },
  {
    name: "LangChain",
    category: "ai",
    ring: 1,
    angle: Math.PI,
    yOffset: 0.15,
    size: 0.2,
    description: "LLM orchestration · RAG",
  },
  {
    name: "OpenCV",
    category: "cv",
    ring: 1,
    angle: Math.PI * 1.45,
    yOffset: -0.22,
    size: 0.2,
    description: "Image + video processing",
  },

  /* -- Ring 2 — infra & specialist tools ------------------------------- */
  {
    name: "FastAPI",
    category: "devops",
    ring: 2,
    angle: 0.1,
    yOffset: 0.35,
    size: 0.16,
    description: "Async microservices",
  },
  {
    name: "Docker",
    category: "devops",
    ring: 2,
    angle: Math.PI * 0.42,
    yOffset: -0.35,
    size: 0.16,
    description: "Containerised deployments",
  },
  {
    name: "FAISS",
    category: "data",
    ring: 2,
    angle: Math.PI * 0.82,
    yOffset: 0.28,
    size: 0.16,
    description: "Vector similarity search",
  },
  {
    name: "YOLO",
    category: "cv",
    ring: 2,
    angle: Math.PI * 1.22,
    yOffset: -0.3,
    size: 0.16,
    description: "Real-time object detection",
  },
  {
    name: "MediaPipe",
    category: "cv",
    ring: 2,
    angle: Math.PI * 1.62,
    yOffset: 0.2,
    size: 0.16,
    description: "Face · pose · hand tracking",
  },

  /* -- Ring 3 — tooling & infra edges ---------------------------------- */
  {
    name: "Flutter",
    category: "frontend",
    ring: 3,
    angle: Math.PI * 0.28,
    yOffset: -0.42,
    size: 0.14,
    description: "Cross-platform mobile",
  },
  {
    name: "PostgreSQL",
    category: "data",
    ring: 3,
    angle: Math.PI * 0.78,
    yOffset: 0.32,
    size: 0.14,
    description: "Relational data store",
  },
  {
    name: "Git",
    category: "devops",
    ring: 3,
    angle: Math.PI * 1.28,
    yOffset: -0.3,
    size: 0.14,
    description: "Source control · collab",
  },
  {
    name: "Linux",
    category: "devops",
    ring: 3,
    angle: Math.PI * 1.78,
    yOffset: 0.38,
    size: 0.14,
    description: "Server + edge deployment",
  },
];

/**
 * Build the list of star pairs to connect. Two types of edges:
 *   - intra-category (bright, category-colored) — between siblings in the
 *     same category
 *   - core-to-ring-1 (faint white) — Python → the 4 foundational frameworks
 */
export function buildEdges(stars: Star[]) {
  const edges: { a: Star; b: Star; strong: boolean; color: string }[] = [];

  // Group by category and connect ring-sorted neighbors.
  const byCat = new Map<StarCategory, Star[]>();
  for (const s of stars) {
    const arr = byCat.get(s.category) ?? [];
    arr.push(s);
    byCat.set(s.category, arr);
  }

  for (const [cat, group] of byCat) {
    if (group.length < 2) continue;
    const sorted = [...group].sort((a, b) => a.ring - b.ring);
    for (let i = 0; i < sorted.length - 1; i++) {
      edges.push({
        a: sorted[i],
        b: sorted[i + 1],
        strong: true,
        color: CATEGORIES[cat].color,
      });
    }
    // Also connect same-ring siblings if more than 2.
    const perRing = new Map<number, Star[]>();
    for (const s of group) {
      const arr = perRing.get(s.ring) ?? [];
      arr.push(s);
      perRing.set(s.ring, arr);
    }
    for (const [, members] of perRing) {
      if (members.length < 2) continue;
      for (let i = 0; i < members.length; i++) {
        const n = members[(i + 1) % members.length];
        edges.push({
          a: members[i],
          b: n,
          strong: true,
          color: CATEGORIES[cat].color,
        });
      }
    }
  }

  // Core (Python) → ring-1 stars only — the master-node spokes.
  const core = stars.find((s) => s.category === "core");
  if (core) {
    stars
      .filter((s) => s.ring === 1)
      .forEach((s) => {
        edges.push({ a: core, b: s, strong: false, color: "#ffffff" });
      });
  }

  return edges;
}
