export type Side = "left" | "right";
export type NodeColor = "cyan" | "violet" | "orange" | "amber";

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
      "Led full AI product roadmap serving 800+ users at 99.7% production uptime",
      "Architected LLM/RAG pipelines and cloud-native infrastructure with FastAPI, Docker, and GitHub Actions CI/CD",
      "Directed cross-functional team across ML engineering, backend, and DevOps",
      "Reduced deployment cycle time by 60% via automated CI/CD pipelines",
      "Evaluated and selected production LLM vendors and vector database solutions",
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
      "Built production rPPG engine achieving 91% HR accuracy at 28 FPS with <145ms latency",
      "Deployed to mobile SDK serving 300+ users with real-time HR/HRV/SpO₂ extraction",
      "Engineered RAG-backed health knowledge retrieval pipeline (LangChain + FAISS)",
      "Built production FastAPI microservices for biometric data processing and storage",
      "Contributed across full product lifecycle: training → deployment → mobile SDK",
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
      "Built 88% accuracy deep learning classifier on 12K industrial samples",
      "Achieved 3× faster anomaly detection vs baseline models",
      "Developed benchmarking scripts and real-time performance dashboards",
    ],
  },
  {
    slug: "iot-freelance",
    side: "left",
    role: "IoT Systems Engineer",
    company: "Freelance",
    period: "2023 – 2025",
    current: false,
    nodeColor: "orange",
    tagline: "Embedded systems · BLE · MQTT",
    visual: "orgChart",
    achievements: [
      "Designed and deployed multi-node ESP32 sensor mesh systems processing 100K+ events/day at sub-50ms latency",
      "Developed BLE 5.0 mesh firmware on nRF52840 for indoor positioning (±1.8m accuracy, 200+ connections)",
      "Built 12-node smart greenhouse with YOLOv5 pest detection at 94% accuracy",
      "Delivered 5+ production IoT deployments for industrial and agricultural clients",
    ],
  },
  {
    slug: "embedded-intern",
    side: "right",
    role: "Embedded Systems Intern",
    company: "Industry Placement",
    period: "2024",
    current: false,
    nodeColor: "amber",
    tagline: "STM32 · FreeRTOS · HAL",
    visual: "confusionMatrix",
    achievements: [
      "Developed STM32 HAL drivers with FreeRTOS achieving <0.8ms interrupt response time",
      "Implemented UART/SPI/I2C communication drivers for industrial sensor peripherals",
      "Documented embedded firmware architecture for team knowledge transfer",
    ],
  },
];

export const NODE_HEX: Record<NodeColor, string> = {
  cyan: "#00D4FF",
  violet: "#7B2FBE",
  orange: "#FF6B35",
  amber: "#F59E0B",
};
