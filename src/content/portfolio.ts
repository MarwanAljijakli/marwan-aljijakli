export type LocalizedText = Readonly<{
  en: string;
  ar: string;
}>;

export type ProjectLink = Readonly<{
  href: string;
  label: LocalizedText;
  external?: boolean;
}>;

export type MediaAsset = Readonly<{
  mp4: string;
  poster: string;
  width: number;
  height: number;
  label: LocalizedText;
  note: LocalizedText;
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
  { href: "#work", label: text("Work", "الأعمال") },
  { href: "#systems", label: text("System range", "نطاق الأنظمة") },
  { href: "#experience", label: text("Experience", "الخبرة") },
  { href: "#recognition", label: text("Recognition", "الإنجازات") },
  { href: "#contact", label: text("Contact", "تواصل") },
] as const;

export const credential = {
  short: text(
    "Saudi Council of Engineers · Active Member",
    "عضو في الهيئة السعودية للمهندسين"
  ),
  full: text(
    "Saudi Council of Engineers · Active Member No. 1272601 · Valid through 13 July 2027",
    "عضو في الهيئة السعودية للمهندسين · رقم العضوية 1272601 · سارية حتى 13 يوليو 2027"
  ),
  number: "1272601",
  numberLabel: text("Member No.", "رقم العضوية"),
  activeTag: text("Active / 2027", "سارية / 2027"),
  valid: text("Valid through 13 July 2027", "سارية حتى 13 يوليو 2027"),
} as const;

export const media = {
  introduction: {
    mp4: "/media/v2-introduction.mp4",
    poster: "/media/v2-introduction-poster.webp",
    width: 1280,
    height: 720,
    label: text("Ambient system study", "مشهد بصري تجريدي للأنظمة"),
    note: text("Ambient visual reference — not project footage", "مرجع بصري تجريدي — ليس تسجيلًا لمشروع"),
  },
  rppg: {
    mp4: "/media/v2-rppg.mp4",
    poster: "/media/v2-rppg-poster.webp",
    width: 800,
    height: 800,
    label: text("Abstract signal visual", "مشهد تجريدي للإشارة"),
    note: text("Ambient visual — the implementation details below are from verified work", "مشهد فني — تفاصيل التنفيذ أدناه من عمل موثّق"),
  },
  awards: {
    mp4: "/media/v2-awards.mp4",
    poster: "/media/v2-awards-poster.webp",
    width: 1280,
    height: 574,
    label: text("Recognition backdrop", "خلفية قسم الإنجازات"),
    note: text("The award record is taken from the supplied CV", "بيانات الجوائز مأخوذة من السيرة الذاتية المرفقة"),
  },
  certifications: {
    mp4: "/media/v2-certifications.mp4",
    poster: "/media/v2-certifications-poster.webp",
    width: 960,
    height: 540,
    label: text("Education backdrop", "خلفية قسم التعليم"),
    note: text("Only the listed credentials belong to Marwan", "المؤهلات المكتوبة فقط هي الخاصة بمروان"),
  },
  contact: {
    mp4: "/media/v2-contact.mp4",
    poster: "/media/v2-contact-poster.webp",
    width: 960,
    height: 540,
    label: text("Contact backdrop", "خلفية قسم التواصل"),
    note: text("Ambient visual", "مشهد بصري"),
  },
} satisfies Record<string, MediaAsset>;

export const hero = {
  eyebrow: text(
    "AI & Data Engineer · CTO at BOHIO · Jeddah",
    "مهندس ذكاء اصطناعي وبيانات · المدير التقني في BOHIO · جدة"
  ),
  titleLines: {
    en: ["I build the model —", "and everything it", "needs to become a", "product."],
    ar: ["أبني النموذج،", "وكل ما يحتاجه", "ليصبح منتجًا."],
  },
  lead: text(
    "My work spans model inference, data pipelines, secure APIs, testing and cloud delivery. I currently lead BOHIO’s architecture for AI-assisted financial modeling.",
    "يمتد عملي من استدلال النماذج وخطوط البيانات إلى الواجهات الآمنة والاختبارات والنشر السحابي. أقود حاليًا معمارية BOHIO للنمذجة المالية المدعومة بالذكاء الاصطناعي."
  ),
  primaryCta: text("See the systems", "استعرض الأنظمة"),
  secondaryCta: text("Download verified CV", "حمّل السيرة الموثّقة"),
  portraitAlt: text("Portrait of Marwan Aljijakli", "صورة مروان الجيجكلي"),
  proof: [
    { value: "01", label: text("Product architecture", "معمارية المنتج") },
    { value: "02", label: text("Model & data systems", "أنظمة النماذج والبيانات") },
    { value: "03", label: text("Release & operations", "الإصدار والتشغيل") },
  ],
} as const;

export const work = {
  eyebrow: text("Selected work", "أعمال مختارة"),
  title: text(
    "What I built, what I owned, and how it works.",
    "ما بنيته، وما تولّيته، وكيف يعمل."
  ),
  intro: text(
    "The projects below separate public product links from private implementation details. No client interface or confidential data is presented as public work.",
    "تفصل المشاريع أدناه بين المنتجات العامة وتفاصيل التنفيذ الخاصة. لا تُعرض أي واجهة عميل أو بيانات سرية على أنها عمل عام."
  ),
  cases: [
    {
      number: "01",
      company: "BOHIO",
      kind: text("Current · Product architecture", "حاليًا · معمارية منتج"),
      title: text(
        "Financial models, engineered as a governed product.",
        "نماذج مالية صُمّمت لتعمل كمنتج منضبط."
      ),
      description: text(
        "I lead the hands-on architecture of an AI-assisted real-estate financial modeling platform, from the calculation engine and workbook workflows to secure data, bilingual product surfaces, admin operations, testing and controlled releases.",
        "أقود المعمارية التنفيذية لمنصة نمذجة مالية عقارية مدعومة بالذكاء الاصطناعي؛ من محرك الحساب ومسارات المصنفات إلى البيانات الآمنة والواجهة ثنائية اللغة وعمليات الإدارة والاختبارات والإصدارات المنضبطة."
      ),
      facts: [
        text("Calculation engine and workbook workflows", "محرك الحساب ومسارات المصنفات"),
        text("Authentication, RLS and product APIs", "المصادقة وRLS وواجهات المنتج"),
        text("Bilingual UX, telemetry and release controls", "تجربة ثنائية اللغة وقياس تشغيلي وضوابط إصدار"),
      ],
      stack: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "ExcelJS"],
      links: [] as ProjectLink[],
      media: null,
    },
    {
      number: "02",
      company: "VLEED",
      kind: text("2024—2025 · Vision + signal", "2024—2025 · رؤية + إشارة"),
      title: text(
        "A camera stream becomes a physiological signal.",
        "يتحوّل بث الكاميرا إلى إشارة فسيولوجية."
      ),
      description: text(
        "I turned an open-source rPPG/POS pipeline into a Dockerized FastAPI service: face-region segmentation with LinkNet, POS signal extraction, FFT analysis and a production-facing API boundary.",
        "حوّلت مسار rPPG/POS مفتوح المصدر إلى خدمة FastAPI داخل Docker: تحديد منطقة الوجه عبر LinkNet، واستخراج الإشارة بخوارزمية POS، وتحليل FFT، ثم تقديمها عبر واجهة جاهزة للمنتج."
      ),
      facts: [
        text("Face region segmentation", "تحديد منطقة الوجه"),
        text("POS extraction and FFT analysis", "استخراج POS وتحليل FFT"),
        text("Dockerized FastAPI delivery", "تسليم الخدمة عبر Docker وFastAPI"),
      ],
      stack: ["Python", "PyTorch", "OpenCV", "FastAPI", "Docker"],
      links: [] as ProjectLink[],
      media: media.rppg,
    },
    {
      number: "03",
      company: "BLUECARE",
      kind: text("Public product · Bilingual AAC", "منتج عام · تواصل بديل ثنائي اللغة"),
      title: text(
        "Communication support designed for three different users.",
        "دعم للتواصل صُمّم لثلاثة أنواع مختلفة من المستخدمين."
      ),
      description: text(
        "A free English-Arabic AAC web app for non-verbal and minimally verbal children with autism, with distinct experiences for children, caregivers and therapists.",
        "تطبيق ويب مجاني للتواصل المعزّز والبديل بالعربية والإنجليزية للأطفال ذوي التوحّد من غير الناطقين أو محدودي النطق، مع تجارب مستقلة للطفل والأسرة والمعالج."
      ),
      facts: [
        text("Child, caregiver and therapist flows", "مسارات للطفل والأسرة والمعالج"),
        text("English and Arabic interfaces", "واجهات بالعربية والإنجليزية"),
        text("Public build and source available", "نسخة عامة ومصدر متاحان"),
      ],
      stack: ["Next.js", "TypeScript", "PostgreSQL", "RTL"],
      links: [
        {
          href: "https://bcare-ten.vercel.app/en",
          label: text("Open live product", "افتح المنتج الحي"),
          external: true,
        },
        {
          href: "https://github.com/MarwanAljijakli/Bcare",
          label: text("View source", "اعرض المصدر"),
          external: true,
        },
      ] as ProjectLink[],
      media: null,
    },
    {
      number: "04",
      company: "WATHBA",
      kind: text("Edge + cloud", "الحافة + السحابة"),
      title: text(
        "Telemetry that remains understandable when a device goes quiet.",
        "قياس تشغيلي يبقى مفهومًا حتى عندما يتوقف الجهاز عن الإرسال."
      ),
      description: text(
        "An edge-to-cloud monitoring flow with ESP32 firmware, NVS configuration, authenticated HTTPS telemetry to Supabase and Vercel, stale-state detection and device diagnostics.",
        "منظومة مراقبة من الحافة إلى السحابة عبر برمجيات ESP32 وإعدادات NVS وإرسال HTTPS موثّق إلى Supabase وVercel، مع اكتشاف تقادم الحالة وتشخيص الجهاز."
      ),
      facts: [
        text("Authenticated device telemetry", "قياس موثّق من الجهاز"),
        text("Stale-state and disconnect handling", "معالجة التقادم والانقطاع"),
        text("Firmware-to-dashboard diagnostics", "تشخيص من البرنامج الثابت إلى لوحة المتابعة"),
      ],
      stack: ["ESP32", "NVS", "HTTPS", "Supabase", "Vercel"],
      links: [] as ProjectLink[],
      media: null,
    },
  ],
} as const;

export const systemAtlas = {
  eyebrow: text("System range", "نطاق النظام"),
  title: text(
    "The model is one layer. The product needs all five.",
    "النموذج طبقة واحدة، والمنتج يحتاج الطبقات الخمس."
  ),
  intro: text(
    "I work across the boundaries that usually split a prototype from a dependable product.",
    "أعمل عبر الحدود التي تفصل عادةً بين النموذج الأولي والمنتج الذي يمكن الاعتماد عليه."
  ),
  layers: [
    {
      number: "01",
      title: text("Model inference", "استدلال النموذج"),
      detail: text("Vision, signals and GPU execution", "الرؤية والإشارات والتنفيذ على GPU"),
    },
    {
      number: "02",
      title: text("Data pipelines", "خطوط البيانات"),
      detail: text("Schemas, transformations and integrity", "المخططات والتحويلات وسلامة البيانات"),
    },
    {
      number: "03",
      title: text("Secure APIs", "واجهات آمنة"),
      detail: text("Authentication, RLS and service boundaries", "المصادقة وRLS وحدود الخدمات"),
    },
    {
      number: "04",
      title: text("Product experience", "تجربة المنتج"),
      detail: text("Bilingual flows and usable decisions", "مسارات ثنائية اللغة وقرارات قابلة للاستخدام"),
    },
    {
      number: "05",
      title: text("Release & observability", "الإصدار والمراقبة"),
      detail: text("Tests, telemetry and controlled delivery", "اختبارات وقياس تشغيلي وتسليم منضبط"),
    },
  ],
} as const;

export const experience = {
  eyebrow: text("Experience", "الخبرة"),
  title: text(
    "Two roles, both close to the code.",
    "دوران مهنيان، وفي كليهما كنت قريبًا من التنفيذ."
  ),
  roles: [
    {
      company: "BOHIO",
      role: text("Chief Technology Officer · Hands-on Technical Lead", "المدير التقني · قائد تقني تنفيذي"),
      date: text("Jan 2026 — Present", "يناير 2026 — الآن"),
      current: true,
      summary: text(
        "Leading architecture and hands-on delivery of a real-estate financial modeling platform with AI-assisted workflows.",
        "أقود معمارية وتنفيذ منصة للنمذجة المالية العقارية بمسارات عمل مدعومة بالذكاء الاصطناعي."
      ),
      stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "ExcelJS"],
    },
    {
      company: "VLEED",
      role: text("AI Engineer", "مهندس ذكاء اصطناعي"),
      date: text("Jun 2024 — Dec 2025", "يونيو 2024 — ديسمبر 2025"),
      current: false,
      summary: text(
        "Productized computer-vision, signal-processing and generative-media pipelines for health and facial-media workflows.",
        "حوّلت مسارات للرؤية الحاسوبية ومعالجة الإشارات والوسائط التوليدية إلى خدمات قابلة للاستخدام في تطبيقات الصحة ووسائط الوجه."
      ),
      stack: ["Python", "PyTorch", "FastAPI", "OpenCV", "Docker"],
    },
  ],
} as const;

export const capabilities = {
  eyebrow: text("Capabilities", "القدرات"),
  title: text(
    "Capabilities I use to carry a system end to end.",
    "قدرات أستخدمها لنقل النظام من الفكرة إلى التشغيل."
  ),
  groups: [
    {
      number: "01",
      title: text("AI, vision & signals", "الذكاء والرؤية والإشارات"),
      items: ["Python", "PyTorch", "OpenCV", "rPPG/POS", "FFT", "LinkNet"],
    },
    {
      number: "02",
      title: text("Application & data", "التطبيق والبيانات"),
      items: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "Supabase", "RLS"],
    },
    {
      number: "03",
      title: text("Quality & delivery", "الجودة والتسليم"),
      items: ["Docker", "GitHub Actions", "Playwright", "Vitest", "Vercel", "Sentry"],
    },
    {
      number: "04",
      title: text("Embedded & telemetry", "الأنظمة المضمنة والقياس"),
      items: ["ESP32", "STM32", "FreeRTOS", "MQTT", "BLE", "I2C/SPI"],
    },
  ],
} as const;

export const recognition = {
  eyebrow: text("Recognition & education", "الإنجازات والتعليم"),
  title: text(
    "Two first places, one third place, and an active engineering membership.",
    "مركزان أولان، ومركز ثالث، وعضوية سارية في هيئة المهندسين."
  ),
  awards: [
    {
      place: text("1st", "المركز الأول"),
      title: text("SAQIR Saudi Aerial Quadcopter Engineering Race", "سباق صقر السعودي لهندسة الطائرات الرباعية"),
      meta: text("Drone Challenge · 2025", "تحدي الطائرات المسيّرة · 2025"),
    },
    {
      place: text("1st", "المركز الأول"),
      title: text("CPC Programming Problem-Solving Competition", "مسابقة CPC لحل مسائل البرمجة"),
      meta: text("Jeddah International College · Team award", "كلية جدة العالمية · جائزة فريق"),
    },
    {
      place: text("3rd", "المركز الثالث"),
      title: text("Taghna AI Hackathon", "هاكاثون تغنى للذكاء الاصطناعي"),
      meta: text("Saudi Arabia · 2025", "المملكة العربية السعودية · 2025"),
    },
  ],
  education: {
    label: text("Education", "التعليم"),
    gpaLabel: text("GPA", "المعدل التراكمي"),
    degree: text("B.Sc. Computer Science", "بكالوريوس علوم الحاسب"),
    specialization: text("Specialization in Artificial Intelligence", "تخصص الذكاء الاصطناعي"),
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
} as const;

export const contact = {
  eyebrow: text("Contact", "تواصل"),
  title: text("Tell me what you are trying to build.", "أخبرني بما تريد بناءه."),
  body: text(
    "For a focused conversation about AI, data, computer vision, backend systems or hands-on technical leadership, reach me directly.",
    "لنقاش واضح حول الذكاء الاصطناعي أو البيانات أو الرؤية الحاسوبية أو الأنظمة الخلفية أو القيادة التقنية التنفيذية، تواصل معي مباشرة."
  ),
  emailLabel: text("Email Marwan", "راسل مروان"),
  linkedinLabel: text("LinkedIn", "LinkedIn"),
  githubLabel: text("GitHub", "GitHub"),
  phoneLabel: text("Call", "اتصل"),
} as const;

export const interfaceCopy = {
  skip: text("Skip to main content", "انتقل إلى المحتوى الرئيسي"),
  home: text("Back to top", "العودة إلى الأعلى"),
  language: text("Switch language", "تبديل اللغة"),
  theme: text("Toggle color theme", "تبديل ألوان الموقع"),
  menu: text("Open navigation", "فتح قائمة التنقل"),
  menuLabel: text("Primary navigation", "التنقل الرئيسي"),
  current: text("Current", "حاليًا"),
  privateWork: text("Private implementation", "تنفيذ خاص"),
  external: text("Opens in a new tab", "يفتح في علامة تبويب جديدة"),
  playVideo: text("Play visual", "تشغيل المشهد"),
  pauseVideo: text("Pause visual", "إيقاف المشهد مؤقتًا"),
  videoUnavailable: text("Visual could not be loaded", "تعذّر تحميل المشهد"),
  copyEmail: text("Copy email", "نسخ البريد"),
  copiedEmail: text("Email copied", "تم نسخ البريد"),
  copyFailed: text("Email selected — press Ctrl+C", "تم تحديد البريد — اضغط Ctrl+C"),
  footer: text("Designed and engineered in Jeddah.", "صُمّم وطُوّر في جدة."),
} as const;
