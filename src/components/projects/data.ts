export type AccentColor = "cyan" | "violet" | "orange" | "amber";

export interface ProjectLink {
  label: string;
  href: string;
  primary?: boolean;
}

export interface ProjectBadge {
  emoji: string;
  label: string;
  tone: "amber" | "cyan" | "violet" | "orange";
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string[];
  impact: string;
  tech: string[];
  accent: AccentColor;
  badge?: ProjectBadge;
  features?: string[];
  metrics?: { label: string; value: string }[];
  links?: ProjectLink[];
  year?: string;
  role?: string;
}

/* -------------------------------------------------------------------------- */
/*  Projects                                                                  */
/* -------------------------------------------------------------------------- */

export const PROJECTS: Project[] = [
  {
    slug: "aura",
    title: "AURA",
    subtitle: "AI Safety Ecosystem for Mining & Industrial Complexes",
    description:
      "End-to-end AI safety platform with real-time PPE compliance tracking, unauthorized zone detection using YOLO-based CV, and automated alerting dashboards. Deployed in high-risk industrial environments.",
    longDescription: [
      "AURA is a full-stack safety intelligence platform that turns existing CCTV infrastructure into a proactive hazard-prevention system. It fuses YOLOv8 detection, multi-object tracking, and zone-aware business rules into a single real-time pipeline.",
      "Operators see live PPE compliance, worker location, and unauthorised entry events on a unified dashboard. Violations auto-escalate through configurable alert pipelines — SMS, Slack, or on-prem sirens — with full audit trails for compliance reporting.",
      "Designed to run at the edge on commodity GPU boxes, AURA scales to dozens of cameras per site with sub-second end-to-end latency.",
    ],
    impact:
      "Improved regulatory compliance and enabled proactive hazard intervention across high-risk industrial environments.",
    tech: [
      "YOLO v8",
      "OpenCV",
      "FastAPI",
      "Docker",
      "Real-time Video Analytics",
      "Alert Pipelines",
      "PostgreSQL",
      "Redis",
    ],
    accent: "orange",
    badge: { emoji: "🏆", label: "Flagship Project", tone: "amber" },
    features: [
      "Real-time PPE compliance detection (helmet, vest, goggles, boots)",
      "Restricted-zone intrusion with per-polygon dwell-time rules",
      "Worker tracking with ByteTrack for identity-stable events",
      "Alert pipelines: SMS, Slack, Webhook, on-prem siren I/O",
      "Operator dashboard with heatmaps + event timeline",
      "Edge deployment via Docker Compose on Jetson / commodity GPU",
    ],
    metrics: [
      { label: "Cameras / site", value: "24+" },
      { label: "End-to-end latency", value: "<1s" },
      { label: "Alert pipelines", value: "5" },
    ],
    year: "2024",
    role: "CTO & Lead Engineer",
    links: [
      { label: "View Project", href: "#", primary: true },
      { label: "Technical Details", href: "#" },
    ],
  },
  {
    slug: "vleed",
    title: "VLEED Health Platform",
    subtitle: "Non-Contact Vital Sign Extraction via Facial Video",
    description:
      "Engineered rPPG engine for Heart Rate, HRV, and SpO₂ extraction from facial video. Integrated RAG pipelines (LangChain + FAISS) for AI-driven health insights. FastAPI microservices on Docker.",
    longDescription: [
      "VLEED is a contactless vital-sign platform that extracts cardiac signals directly from a user's webcam. A MediaPipe-driven face ROI pipeline stabilises the signal; FFT + ICA separates pulse from noise; and the platform cross-checks HR / HRV / SpO₂ against motion and lighting confidence scores.",
      "A RAG layer on top of the biometric history gives clinicians natural-language access to each patient's trajectory — LangChain retrieves time-windowed facts from a FAISS index backed by a clinical knowledge base.",
      "Deployed as a pack of FastAPI microservices behind a Flutter mobile client, orchestrated in Docker for on-prem hospital installs.",
    ],
    impact:
      "Real-time biometric monitoring without wearable contact — enabling remote triage and continuous health screening at scale.",
    tech: [
      "rPPG",
      "LangChain",
      "FAISS",
      "FastAPI",
      "Docker",
      "SQL",
      "MediaPipe",
      "Flutter",
    ],
    accent: "cyan",
    features: [
      "rPPG signal extraction with motion/lighting gating",
      "HR, HRV (RMSSD/SDNN), and SpO₂ estimates from a single camera",
      "Clinical RAG assistant (LangChain + FAISS)",
      "Flutter mobile front-end with on-device preview",
      "FastAPI microservice mesh with per-service health checks",
    ],
    metrics: [
      { label: "Inference", value: "Real-time" },
      { label: "Contact required", value: "None" },
      { label: "Signals", value: "HR · HRV · SpO₂" },
    ],
    year: "2024",
    role: "AI Engineer",
    links: [
      { label: "View Project", href: "#", primary: true },
      { label: "Technical Details", href: "#" },
    ],
  },
  {
    slug: "wathba",
    title: "Wathba",
    subtitle: "AI for Saudi Mining Sector — Future Minerals Pioneers",
    description:
      "AI-driven predictive models addressing operational and safety challenges in Saudi mining. Advanced to finals of national Future Minerals Pioneers competition with practical AI solutions for resource management.",
    longDescription: [
      "Wathba tackles the operational realities of mining in the Kingdom: mixed-grade deposits, long supply chains, and strict HSE obligations. The stack ingests SCADA telemetry, satellite imagery, and manual reports into a unified feature store.",
      "Predictive models surface production shortfalls, equipment degradation, and safety risks before they compound. A computer-vision component reviews drone footage to map stockpiles and infer grade variance.",
      "Wathba was selected as a finalist in the national Future Minerals Pioneers competition — one of the flagship innovation tracks within Saudi Arabia's Vision 2030 mining agenda.",
    ],
    impact:
      "Finalist in a national mining-innovation competition. Demonstrated practical AI pathways for Saudi resource management.",
    tech: [
      "Predictive ML",
      "Data Engineering",
      "Python",
      "Computer Vision",
      "Pandas",
      "Scikit-learn",
    ],
    accent: "amber",
    badge: { emoji: "🥇", label: "Competition Finalist", tone: "amber" },
    features: [
      "Predictive models for production shortfalls and equipment failure",
      "CV-based stockpile mapping from drone imagery",
      "Feature store over SCADA telemetry + satellite + manual reports",
      "Safety-risk ranking with explainable feature contributions",
    ],
    metrics: [
      { label: "Competition stage", value: "Finalist" },
      { label: "Signal sources", value: "3" },
      { label: "Sector", value: "Mining" },
    ],
    year: "2024",
    role: "AI Engineer",
    links: [
      { label: "View Project", href: "#", primary: true },
      { label: "Technical Details", href: "#" },
    ],
  },
  {
    slug: "rag",
    title: "Enterprise RAG Pipeline",
    subtitle: "Production Retrieval-Augmented Generation Architecture",
    description:
      "Built production RAG systems using LangChain, FAISS, and Chroma for real-time intelligent document retrieval. Deployed for medical data analysis at VLEED.",
    longDescription: [
      "A hardened RAG pipeline that has been battle-tested against the realities of enterprise data: dirty PDFs, privacy constraints, and evolving schemas. Documents are parsed, chunked with semantic boundaries, and enriched with metadata before embedding.",
      "Retrieval uses a hybrid BM25 + dense-vector score with a cross-encoder re-rank on top. The answer layer combines GPT-4 and Claude behind a model-routing policy that picks the best generator per query class.",
      "Instrumented end-to-end with OpenTelemetry — every retrieval, prompt, and generation is traceable, which turned out to be the single most important feature for the clinicians who use it.",
    ],
    impact:
      "Powers real-time intelligent document retrieval in a medical setting — turning unstructured records into queryable, cited answers.",
    tech: [
      "LangChain",
      "FAISS",
      "Chroma",
      "GPT-4",
      "Claude",
      "Vector DBs",
      "Python",
      "OpenTelemetry",
    ],
    accent: "violet",
    features: [
      "Semantic-boundary chunking with metadata enrichment",
      "Hybrid BM25 + dense retrieval with cross-encoder re-rank",
      "Model-routing policy (GPT-4 / Claude) per query class",
      "End-to-end OpenTelemetry tracing — retrieval, prompt, generation",
      "Citation-first answer formatting with source-link preservation",
    ],
    metrics: [
      { label: "Models routed", value: "GPT-4 · Claude" },
      { label: "Vector stores", value: "FAISS · Chroma" },
      { label: "Trace coverage", value: "100%" },
    ],
    year: "2024",
    role: "AI Engineer",
    links: [
      { label: "View Project", href: "#", primary: true },
      { label: "Technical Details", href: "#" },
    ],
  },
];
