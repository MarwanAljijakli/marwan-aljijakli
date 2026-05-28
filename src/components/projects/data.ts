export type AccentColor = "cyan" | "violet" | "orange" | "amber" | "green";

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
      { label: "Detection Accuracy", value: "94.2% mAP" },
      { label: "Live Streams", value: "6 simultaneous RTSP" },
      { label: "Processing Speed", value: "28 FPS" },
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
      { label: "HR Accuracy", value: "91%" },
      { label: "Processing Speed", value: "28 FPS" },
      { label: "Latency", value: "<145ms" },
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
      { label: "Prediction Accuracy", value: "88%" },
      { label: "Teams Competing", value: "38" },
      { label: "Competition Result", value: "Finalist" },
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
      { label: "Query Latency", value: "<165ms" },
      { label: "Precision@5", value: "76%" },
      { label: "Knowledge Base", value: "30K documents" },
    ],
    year: "2024",
    role: "AI Engineer",
    links: [
      { label: "View Project", href: "#", primary: true },
      { label: "Technical Details", href: "#" },
    ],
  },
  {
    slug: "greenhouse",
    title: "Smart Greenhouse",
    subtitle: "12-Node IoT Mesh + YOLOv5 Pest Detection",
    description:
      "12-node ESP32 sensor mesh with automated climate control and YOLOv5-based plant disease and pest detection. Full pipeline from sensor ingestion to computer vision inference at sub-500ms latency.",
    longDescription: [
      "A distributed IoT system spanning 12 ESP32 nodes communicating over MQTT with a central Node-RED orchestrator. Each node manages temperature, humidity, soil moisture, and light sensors with closed-loop PID control for actuators.",
      "YOLOv5 inference runs on edge hardware scanning camera feeds for early signs of disease and pest infestation, triggering targeted treatment alerts before spread occurs.",
      "Telemetry is pushed to InfluxDB for time-series analytics; Grafana dashboards give growers a live operational view of all 12 zones simultaneously.",
    ],
    impact:
      "Enabled early pest detection and automated climate response, reducing crop loss and manual monitoring overhead.",
    tech: ["ESP32", "YOLOv5", "MQTT", "Python", "Node-RED", "InfluxDB"],
    accent: "green",
    features: [
      "12-node ESP32 sensor mesh with sub-50ms inter-node latency",
      "YOLOv5 pest and disease detection at 94% accuracy",
      "Closed-loop PID climate control (temperature, humidity, ventilation)",
      "MQTT broker with Node-RED flow orchestration",
      "InfluxDB time-series storage + Grafana dashboards",
    ],
    metrics: [
      { label: "Pest Detection Accuracy", value: "94%" },
      { label: "Sensor Nodes", value: "12" },
      { label: "End-to-End Latency", value: "<500ms" },
    ],
    year: "2024",
    role: "IoT Systems Engineer",
    links: [
      { label: "GitHub", href: "https://github.com/MarwanAljijakli", primary: true },
    ],
  },
  {
    slug: "ble-positioning",
    title: "BLE Indoor Positioning",
    subtitle: "Sub-2m Accuracy Navigation via nRF52840 + BLE 5.0",
    description:
      "Bluetooth 5.0 mesh firmware on nRF52840 with trilateration-based indoor positioning achieving ±1.8m accuracy across 200+ simultaneous connections. Designed for large-scale industrial facility navigation.",
    longDescription: [
      "A BLE 5.0 mesh network built on the nRF52840 SoC with custom C/C++ firmware. Each anchor node broadcasts calibrated RSSI beacons; a Python post-processing layer applies weighted trilateration with Kalman filtering to produce stable position estimates.",
      "The system supports 200+ simultaneous connections with sub-100ms position update rates, making it viable for real-time worker and asset tracking in industrial environments.",
      "Firmware runs FreeRTOS with custom BLE stack configuration to maximise connection density while staying within regulatory RF power limits.",
    ],
    impact:
      "Delivered ±1.8m indoor positioning accuracy at scale, enabling real-time asset and personnel tracking without GPS infrastructure.",
    tech: ["nRF52840", "BLE 5.0", "C/C++", "FreeRTOS", "Python", "RSSI trilateration"],
    accent: "violet",
    features: [
      "BLE 5.0 mesh firmware on nRF52840 with FreeRTOS",
      "Weighted trilateration with Kalman filtering",
      "200+ simultaneous BLE connections",
      "±1.8m position accuracy in multi-path environments",
      "Sub-100ms position update rate",
    ],
    metrics: [
      { label: "Position Accuracy", value: "±1.8m" },
      { label: "Simultaneous Connections", value: "200+" },
      { label: "Firmware", value: "BLE 5.0 Mesh" },
    ],
    year: "2023",
    role: "Embedded Systems Engineer",
    links: [
      { label: "GitHub", href: "https://github.com/MarwanAljijakli", primary: true },
    ],
  },
];
