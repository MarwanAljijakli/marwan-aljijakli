export type LocalizedText = Readonly<{
  en: string;
  ar: string;
}>;

const text = (en: string, ar: string): LocalizedText => ({ en, ar });

export const site = {
  name: "Marwan Aljijakli",
  email: "marwan2004000@gmail.com",
  phoneDisplay: "+966 572 221 939",
  phoneHref: "tel:+966572221939",
  location: text("Jeddah, Saudi Arabia", "جدة، المملكة العربية السعودية"),
  role: text("AI & Data Engineer", "مهندس ذكاء اصطناعي وبيانات"),
  social: {
    linkedin: "https://www.linkedin.com/in/marwan-aljijakli-7ba965241/",
    github: "https://github.com/MarwanAljijakli",
  },
  cv: "/marwan-cv.pdf",
} as const;

export const navItems = [
  { href: "#about", label: text("Profile", "نبذة") },
  { href: "#experience", label: text("Experience", "الخبرة") },
  { href: "#work", label: text("Selected work", "أعمال مختارة") },
  { href: "#toolkit", label: text("Toolkit", "الخبرات التقنية") },
  { href: "#recognition", label: text("Recognition", "الإنجازات") },
  { href: "#contact", label: text("Contact", "تواصل") },
] as const;

export const hero = {
  eyebrow: text(
    "AI & Data Engineer · CTO · Jeddah",
    "مهندس ذكاء اصطناعي وبيانات · مدير تقني · جدة"
  ),
  lead: text(
    "I build AI and data systems from architecture to production.",
    "أبني أنظمة الذكاء الاصطناعي والبيانات من المعمارية حتى التشغيل الفعلي."
  ),
  summary: text(
    "End-to-end technical ownership across data pipelines, model inference, secure APIs, testing and cloud delivery. Currently leading BOHIO's architecture for AI-assisted financial modeling.",
    "أتولى المنتج تقنيًا من بدايته إلى نهايته: من خطوط البيانات واستدلال النماذج، إلى الواجهات الآمنة والاختبارات والنشر السحابي. أقود حاليًا معمارية BOHIO للنمذجة المالية المدعومة بالذكاء الاصطناعي."
  ),
  status: text(
    "Based in Jeddah · Valid Saudi Iqama",
    "مقيم في جدة · إقامة سعودية سارية"
  ),
  primaryCta: text("Explore selected work", "استعرض الأعمال المختارة"),
  secondaryCta: text("Download CV", "تحميل السيرة الذاتية"),
  portraitAlt: text(
    "Portrait of Marwan Aljijakli",
    "صورة شخصية لمروان الجيجكلي"
  ),
  systemLabel: text("Working range", "نطاق العمل"),
  systemSteps: [
    text("Model", "النموذج"),
    text("API", "الواجهة"),
    text("Product", "المنتج"),
    text("Production", "الإنتاج"),
  ],
  proof: [
    { value: "4.35/5.0", label: text("GPA", "المعدل الجامعي") },
    { value: "03", label: text("Competition awards", "جوائز تنافسية") },
    { value: "02", label: text("First-place finishes", "مركزان أول") },
    { value: "2027", label: text("SCE membership valid", "عضوية الهيئة سارية") },
  ],
} as const;

export const profile = {
  index: "01",
  eyebrow: text("Profile", "نبذة"),
  title: text(
    "A model is only the beginning.",
    "النموذج مجرد البداية."
  ),
  intro: text(
    "My work connects computer vision and signal processing with backend architecture, data design, testing and product delivery. I stay with the system beyond the prototype, through the decisions that make it secure, observable and usable.",
    "يربط عملي بين الرؤية الحاسوبية ومعالجة الإشارات من جهة، وهندسة الخلفية وتصميم البيانات وتسليم المنتج من جهة أخرى. لا أتوقف عند النموذج الأولي؛ أتابع النظام حتى يصبح آمنًا وقابلًا للرصد وسهل الاستخدام."
  ),
  closer: text(
    "That range is not a list of tools. It is how I turn an idea into a working product.",
    "هذا الاتساع ليس قائمة أدوات؛ بل طريقتي في تحويل الفكرة إلى منتج يعمل فعلًا."
  ),
  lanes: [
    {
      number: "01",
      title: text("Models & signals", "النماذج والإشارات"),
      description: text(
        "Computer vision, rPPG/POS, semantic segmentation, generative media and GPU inference.",
        "الرؤية الحاسوبية وrPPG/POS والتقسيم الدلالي والوسائط التوليدية والاستدلال على GPU."
      ),
    },
    {
      number: "02",
      title: text("Systems & data", "الأنظمة والبيانات"),
      description: text(
        "Secure APIs, PostgreSQL/Supabase, ETL, schema design, migrations, authentication and RLS.",
        "واجهات آمنة وPostgreSQL/Supabase وخطوط ETL وتصميم المخططات والترحيلات والمصادقة وRLS."
      ),
    },
    {
      number: "03",
      title: text("Product & delivery", "المنتج والتسليم"),
      description: text(
        "Bilingual product surfaces, tests, observability, Docker, CI and controlled cloud releases.",
        "منتجات ثنائية اللغة واختبارات ومراقبة تشغيلية وDocker وتكامل مستمر وإصدارات سحابية منضبطة."
      ),
    },
  ],
} as const;

export const experience = {
  index: "02",
  eyebrow: text("Experience", "الخبرة"),
  title: text("Ownership, not hand-offs.", "ملكية كاملة، لا مجرد تسليم مهام."),
  intro: text(
    "Two roles, one consistent pattern: understand the hard technical core, then carry it safely into a product people can use.",
    "دوران مهنيان بنمط واحد ثابت: فهم جوهر المشكلة التقنية، ثم نقلها بأمان إلى منتج يمكن للناس استخدامه."
  ),
  roles: [
    {
      company: "BOHIO",
      role: text(
        "Chief Technology Officer · Hands-on Technical Lead",
        "المدير التقني · قائد تقني تنفيذي"
      ),
      date: text("Jan 2026 — Present", "يناير 2026 — الآن"),
      current: true,
      summary: text(
        "Leading architecture and hands-on delivery of a real-estate financial modeling platform with AI-assisted workflows.",
        "أقود معمارية وتنفيذ منصة للنمذجة المالية العقارية، مدعومة بمسارات عمل تعتمد على الذكاء الاصطناعي."
      ),
      bullets: [
        text(
          "Built across Next.js, TypeScript, Supabase/PostgreSQL, ExcelJS and HyperFormula.",
          "بنيت المنظومة باستخدام Next.js وTypeScript وSupabase/PostgreSQL وExcelJS وHyperFormula."
        ),
        text(
          "Own the calculation engine, APIs, collaboration, billing, bilingual UX, admin console, RLS, telemetry, tests and deployment controls.",
          "أتولى محرك الحساب والواجهات والتعاون والفوترة والتجربة ثنائية اللغة ولوحة الإدارة وRLS والقياس التشغيلي والاختبارات وضوابط النشر."
        ),
      ],
      stack: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "ExcelJS"],
    },
    {
      company: "VLEED",
      role: text("AI Engineer", "مهندس ذكاء اصطناعي"),
      date: text("Jun 2024 — Dec 2025", "يونيو 2024 — ديسمبر 2025"),
      current: false,
      summary: text(
        "Productized computer-vision and generative-AI pipelines for health and facial-media workflows.",
        "حوّلت مسارات للرؤية الحاسوبية والذكاء التوليدي إلى خدمات قابلة للاستخدام في تطبيقات الصحة ووسائط الوجه."
      ),
      bullets: [
        text(
          "Turned an open-source rPPG/POS pipeline into a Dockerized FastAPI service using OpenCV, LinkNet and FFT signal analysis.",
          "حوّلت مسار rPPG/POS مفتوح المصدر إلى خدمة FastAPI داخل Docker باستخدام OpenCV وLinkNet وتحليل إشارات FFT."
        ),
        text(
          "Built FacePic workflows with InsightFace, InstantID, SDXL and Stable Video Diffusion, and contributed to Flutter and Flask/MySQL product surfaces.",
          "بنيت مسارات FacePic باستخدام InsightFace وInstantID وSDXL وStable Video Diffusion، وساهمت في تطبيق Flutter وخلفية Flask/MySQL."
        ),
      ],
      stack: ["Python", "PyTorch", "FastAPI", "OpenCV", "Docker"],
    },
  ],
} as const;

export type ProjectLink = Readonly<{
  href: string;
  label: LocalizedText;
  external?: boolean;
}>;

export const work = {
  index: "03",
  eyebrow: text("Selected work", "أعمال مختارة"),
  title: text("Systems with a reason to exist.", "أنظمة بُنيت لسبب حقيقي."),
  intro: text(
    "A selection of verified product, data and embedded work. Public links are included where the source or live build is actually available.",
    "مجموعة موثقة من أعمال المنتجات والبيانات والأنظمة المضمنة. أضع الرابط العام فقط عندما يكون المصدر أو المنتج الحي متاحًا فعلًا."
  ),
  projects: [
    {
      number: "01",
      kind: text("Personal portfolio · 2023—2025", "محفظة مشاريع شخصية · 2023—2025"),
      title: "Connected IoT Monitoring Systems",
      description: text(
        "A family of ESP32 and MQTT systems spanning firmware, BLE workflows, REST integrations, live dashboards, device diagnostics, edge-AI prototypes and OTA delivery.",
        "مجموعة أنظمة ESP32 وMQTT تشمل البرمجيات الثابتة ومسارات BLE وتكاملات REST ولوحات المتابعة الحية وتشخيص الأجهزة ونماذج Edge AI والتحديثات الهوائية."
      ),
      stack: ["ESP32", "MQTT", "BLE", "React", "Chart.js", "OTA"],
      links: [] as ProjectLink[],
      featured: true,
    },
    {
      number: "02",
      kind: text("Edge + cloud", "الحافة + السحابة"),
      title: "Wathba",
      description: text(
        "An edge-and-cloud monitoring flow with ESP32 firmware, NVS configuration, authenticated HTTPS telemetry to Supabase/Vercel, stale-state detection and device diagnostics.",
        "منظومة مراقبة تربط الحافة بالسحابة عبر برمجيات ESP32 وإعدادات NVS وإرسال HTTPS موثّق إلى Supabase/Vercel، مع اكتشاف الانقطاع وتشخيص الأجهزة."
      ),
      stack: ["ESP32", "NVS", "HTTPS", "Supabase", "Vercel"],
      links: [] as ProjectLink[],
      featured: false,
    },
    {
      number: "03",
      kind: text("Embedded platform · 2024", "منصة أنظمة مضمنة · 2024"),
      title: "STM32 Sensor & Telemetry Platform",
      description: text(
        "HAL drivers and FreeRTOS integration across I2C/SPI, feeding Python and InfluxDB ingestion, Grafana dashboards and hardware validation through oscilloscopes, logic analyzers and JTAG.",
        "تعريفات HAL وتكامل FreeRTOS عبر I2C/SPI، مع إدخال البيانات باستخدام Python وInfluxDB ولوحات Grafana والتحقق العتادي بأجهزة القياس وJTAG."
      ),
      stack: ["STM32", "FreeRTOS", "I2C/SPI", "InfluxDB", "Grafana", "JTAG"],
      links: [] as ProjectLink[],
      featured: false,
    },
    {
      number: "04",
      kind: text("Public product · Bilingual AAC", "منتج عام · تواصل بديل ثنائي اللغة"),
      title: "BlueCare",
      description: text(
        "A free English-Arabic AAC web app for non-verbal and minimally verbal children with autism, with dedicated experiences for children, caregivers and therapists.",
        "تطبيق ويب مجاني للتواصل المعزّز والبديل بالإنجليزية والعربية، مخصص للأطفال ذوي التوحّد من غير الناطقين أو محدودي النطق، مع تجارب مستقلة للطفل والأسرة والمعالج."
      ),
      stack: ["Next.js", "TypeScript", "PostgreSQL", "AI APIs", "RTL"],
      links: [
        {
          href: "https://bcare-ten.vercel.app/en",
          label: text("Open live build", "فتح النسخة الحية"),
          external: true,
        },
        {
          href: "https://github.com/MarwanAljijakli/Bcare",
          label: text("View repository", "عرض المستودع"),
          external: true,
        },
      ] as ProjectLink[],
      featured: true,
    },
    {
      number: "05",
      kind: text("Public security lab", "مختبر أمني عام"),
      title: "DeceptionGPT",
      description: text(
        "An adaptive SSH honeypot lab combining Python and .NET, with AI-backed command responses, a deterministic fallback path and live interaction logging.",
        "مختبر SSH honeypot تكيفي يجمع Python و.NET، مع استجابات مدعومة بالذكاء الاصطناعي ومسار بديل حتمي وتسجيل حي للتفاعلات."
      ),
      stack: ["Python", ".NET", "Flask", "SSH", "LLM"],
      links: [
        {
          href: "https://github.com/MarwanAljijakli/HoP",
          label: text("View repository", "عرض المستودع"),
          external: true,
        },
      ] as ProjectLink[],
      featured: false,
    },
  ],
} as const;

export const toolkit = {
  index: "04",
  eyebrow: text("Toolkit", "الخبرات التقنية"),
  title: text("Depth where it matters. Range where it helps.", "عمقٌ عند الحاجة، واتساعٌ عندما يخدم المنتج."),
  intro: text(
    "Grouped by the kind of problem each tool helps solve — not by how many logos fit on a screen.",
    "مصنفة بحسب المشكلة التي تساعد على حلها، لا بحسب عدد الشعارات التي تتسع لها الشاشة."
  ),
  groups: [
    {
      number: "01",
      title: text("AI, vision & signals", "الذكاء والرؤية والإشارات"),
      items: ["Python", "PyTorch", "TorchVision", "OpenCV", "NumPy", "SciPy", "rPPG/POS", "FFT", "LinkNet"],
    },
    {
      number: "02",
      title: text("Generative AI & GPU inference", "الذكاء التوليدي والاستدلال على GPU"),
      items: ["Hugging Face", "Diffusers", "InsightFace", "InstantID", "ControlNet", "SDXL", "ONNX Runtime", "FP16/TF32"],
    },
    {
      number: "03",
      title: text("LLM application systems", "أنظمة تطبيقات النماذج اللغوية"),
      items: ["OpenAI APIs", "Anthropic APIs", "Vercel AI SDK", "Streaming", "Tool calling", "Structured output", "Rate limiting"],
    },
    {
      number: "04",
      title: text("Data & backend engineering", "هندسة البيانات والخلفية"),
      items: ["FastAPI", "Flask", "REST", "PostgreSQL", "Supabase", "MySQL", "Python ETL", "Migrations", "RLS", "Auth"],
    },
    {
      number: "05",
      title: text("Cloud, quality & product", "السحابة والجودة والمنتج"),
      items: ["Docker", "GitHub Actions", "Vercel", "Sentry", "Playwright", "Vitest", "Next.js", "TypeScript", "React", "Flutter"],
    },
    {
      number: "06",
      title: text("Embedded & telemetry", "الأنظمة المضمنة والقياس"),
      items: ["ESP32", "STM32", "FreeRTOS", "MQTT", "BLE", "I2C/SPI", "InfluxDB", "Grafana", "JTAG", "OTA"],
    },
  ],
} as const;

export const recognition = {
  index: "05",
  eyebrow: text("Recognition & education", "الإنجازات والتعليم"),
  title: text("Built in competition. Grounded in study.", "خبرة صقلتها المنافسة، وأساس رسّخته الدراسة."),
  awardsLabel: text("Awards", "الجوائز"),
  awards: [
    {
      place: text("1st", "المركز الأول"),
      title: text(
        "SAQIR Saudi Aerial Quadcopter Engineering Race",
        "سباق صقر السعودي لهندسة الطائرات الرباعية"
      ),
      meta: text("Drone Challenge · 2025", "تحدي الطائرات المسيّرة · 2025"),
    },
    {
      place: text("1st", "المركز الأول"),
      title: text(
        "CPC Programming Problem-Solving Competition",
        "مسابقة CPC لحل مسائل البرمجة"
      ),
      meta: text("Jeddah International College · Team award", "كلية جدة العالمية · جائزة فريق"),
    },
    {
      place: text("3rd", "المركز الثالث"),
      title: text("Taghna AI Hackathon", "هاكاثون تغنى للذكاء الاصطناعي"),
      meta: text("Saudi Arabia · 2025", "المملكة العربية السعودية · 2025"),
    },
  ],
  education: {
    eyebrow: text("Education", "التعليم"),
    degree: text(
      "B.Sc. Computer Science",
      "بكالوريوس علوم الحاسب"
    ),
    specialization: text(
      "Specialization in Artificial Intelligence",
      "تخصص الذكاء الاصطناعي"
    ),
    institution: text("Jeddah International College · 2026", "كلية جدة العالمية · 2026"),
    gpa: "4.35/5.0",
  },
  training: [
    text("SDAIA advanced AI/ML curriculum and projects", "برنامج متقدم في الذكاء الاصطناعي وتعلّم الآلة لدى سدايا"),
    text("KAUST applied AI research and engineering program", "برنامج كاوست التطبيقي في أبحاث وهندسة الذكاء الاصطناعي"),
  ],
  leadership: text(
    "President, SWAICY Club · Head of Student Affairs, Computer Science/IT",
    "رئيس نادي SWAICY · رئيس شؤون الطلاب في علوم الحاسب وتقنية المعلومات"
  ),
  sce: text(
    "Active Saudi Council of Engineers member · Valid through 13 Jul 2027",
    "عضو نشط في الهيئة السعودية للمهندسين · العضوية سارية حتى 13 يوليو 2027"
  ),
} as const;

export const contact = {
  index: "06",
  eyebrow: text("Contact", "تواصل"),
  title: text(
    "If the problem spans model, backend and product, we should talk.",
    "إذا كانت المشكلة تمتد من النموذج إلى الخلفية والمنتج، فلنتحدث."
  ),
  body: text(
    "For conversations about AI, data, computer vision, backend systems or hands-on technical leadership, reach me directly.",
    "للنقاش حول الذكاء الاصطناعي والبيانات والرؤية الحاسوبية والأنظمة الخلفية أو القيادة التقنية التنفيذية، تواصل معي مباشرة."
  ),
  emailLabel: text("Write an email", "أرسل بريدًا"),
  copyLabel: text("Copy email", "نسخ البريد"),
  copiedLabel: text("Email copied", "تم نسخ البريد"),
  phoneLabel: text("Call", "اتصل"),
  linkedinLabel: text("LinkedIn profile", "حساب LinkedIn"),
  githubLabel: text("GitHub profile", "حساب GitHub"),
} as const;

export const interfaceCopy = {
  skip: text("Skip to main content", "انتقل إلى المحتوى الرئيسي"),
  home: text("Back to top", "العودة إلى الأعلى"),
  language: text("Switch language", "تبديل اللغة"),
  theme: text("Toggle color theme", "تبديل ألوان الموقع"),
  menu: text("Open navigation", "فتح قائمة التنقل"),
  menuLabel: text("Primary navigation", "التنقل الرئيسي"),
  current: text("Current role", "الدور الحالي"),
  privateWork: text("Case summary", "ملخص المشروع"),
  external: text("Opens in a new tab", "يفتح في علامة تبويب جديدة"),
  footer: text(
    "Designed and engineered with restraint in Jeddah.",
    "صُمّم وطُوّر بعناية في جدة."
  ),
} as const;
