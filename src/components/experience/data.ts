export type Side = "left" | "right";
export type NodeColor = "cyan" | "violet" | "orange";

export interface Experience {
  slug: string;
  side: Side;
  role: string;
  company: string;
  period: string;
  current?: boolean;
  nodeColor: NodeColor;
  achievements: string[];
  /** Key for dispatching to the right visual component. */
  visual: "orgChart" | "heartLine" | "confusionMatrix";
  /** Optional short tagline shown above the role in the card. */
  tagline?: string;
}

export const EXPERIENCES: Experience[] = [
  {
    slug: "bohio-cto",
    side: "right",
    role: "Chief Technology Officer",
    company: "BOHIO",
    period: "2025 – Present",
    current: true,
    nodeColor: "cyan",
    tagline: "Technology leadership",
    visual: "orgChart",
    achievements: [
      "Defined technology strategy and AI product roadmap",
      "Led cross-functional teams delivering AI-powered products",
      "Architected scalable cloud-native AI systems (Docker + FastAPI + Vector DBs)",
      "Oversaw full-stack AI: LLM integration, RAG pipelines, fine-tuning workflows",
      "Drove rapid prototyping and vibe coding sessions for feature validation",
    ],
  },
  {
    slug: "vleed-ai-eng",
    side: "left",
    role: "AI Engineer",
    company: "VLEED",
    period: "June 2025 – Present",
    current: true,
    nodeColor: "violet",
    tagline: "Health platform · biometrics",
    visual: "heartLine",
    achievements: [
      "Engineered rPPG engine: Heart Rate, HRV, SpO₂ from facial video",
      "Deployed RAG pipelines (LangChain + FAISS/Chroma) for medical data analysis",
      "Built production FastAPI services on Docker for live video processing",
      "Unified wearable APIs + lab data into SQL data warehouse",
      "Contributed across full product lifecycle: training → deployment → insights",
    ],
  },
  {
    slug: "taghna-ai-eng",
    side: "right",
    role: "AI Engineer & Data Analyst",
    company: "Taghna",
    period: "March 2025 – June 2025",
    nodeColor: "orange",
    tagline: "Applied ML · benchmarking",
    visual: "confusionMatrix",
    achievements: [
      "Built and trained deep learning classification models end-to-end",
      "Developed benchmarking scripts and real-time performance dashboards",
      "Collaborated with stakeholders to align ML accuracy with business goals",
    ],
  },
];

export const NODE_HEX: Record<NodeColor, string> = {
  cyan: "#00D4FF",
  violet: "#7B2FBE",
  orange: "#FF6B35",
};
