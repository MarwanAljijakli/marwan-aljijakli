export type Locale = "en" | "ar";

export type LocalizedText = Readonly<{
  en: string;
  ar: string;
}>;

export type ProjectLink = Readonly<{
  href: string | LocalizedText;
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

export type ProjectImage = Readonly<{
  type: "image";
  src: LocalizedText;
  alt: LocalizedText;
  browserLabel: LocalizedText;
  width: number;
  height: number;
}>;

export type ProjectVideo = Readonly<{
  type: "video";
  asset: MediaAsset;
}>;

export const text = (en: string, ar: string): LocalizedText => ({ en, ar });
export const localize = (value: LocalizedText, locale: Locale) => value[locale];

export const site = {
  name: "Marwan Aljijakli",
  nameArabic: "مروان الجيجكلي",
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
  { href: "#approach", label: text("Approach", "المنهجية") },
  { href: "#experience", label: text("Experience", "الخبرة") },
  { href: "#expertise", label: text("Expertise", "المهارات") },
  { href: "#recognition", label: text("Recognition", "الإنجازات") },
  { href: "#contact", label: text("Contact", "التواصل") },
] as const;

export const credential = {
  short: text(
    "Active member of the Saudi Council of Engineers",
    "عضو ساري العضوية في الهيئة السعودية للمهندسين"
  ),
  number: "1272601",
  numberLabel: text("Membership no.", "رقم العضوية"),
  valid: text("Valid through 13 July 2027", "سارية حتى 13 يوليو 2027"),
  activeTag: text("Active membership", "عضوية سارية"),
} as const;

export const media = {
  introduction: {
    mp4: "/media/v2-introduction.mp4",
    poster: "/media/v2-introduction-poster.webp",
    width: 1280,
    height: 720,
    label: text("Systems in motion", "أنظمة قيد التشغيل"),
    note: text("A visual study of connected technical systems", "دراسة بصرية لأنظمة تقنية مترابطة"),
  },
  rppg: {
    mp4: "/media/v2-rppg.mp4",
    poster: "/media/v2-rppg-poster.webp",
    width: 800,
    height: 800,
    label: text("Facial video to pulse signal", "من فيديو الوجه إلى إشارة النبض"),
    note: text("Visualized from verified rPPG engineering work", "تصوّر مبني على عمل هندسي موثّق في rPPG"),
  },
  awards: {
    mp4: "/media/v2-awards.mp4",
    poster: "/media/v2-awards-poster.webp",
    width: 1280,
    height: 574,
    label: text("Engineering recognition", "إنجازات هندسية"),
    note: text("Award details are taken from the supplied CV", "تفاصيل الجوائز مأخوذة من السيرة الذاتية المرفقة"),
  },
  certifications: {
    mp4: "/media/v2-certifications.mp4",
    poster: "/media/v2-certifications-poster.webp",
    width: 960,
    height: 540,
    label: text("Education and training", "التعليم والتدريب"),
    note: text("Only the listed credentials belong to Marwan", "المؤهلات المكتوبة فقط هي الخاصة بمروان"),
  },
  contact: {
    mp4: "/media/v2-contact.mp4",
    poster: "/media/v2-contact-poster.webp",
    width: 960,
    height: 540,
    label: text("Start a conversation", "ابدأ محادثة"),
    note: text("Direct contact details below", "بيانات التواصل المباشر أدناه"),
  },
} satisfies Record<string, MediaAsset>;

export const hero = {
  eyebrow: text(
    "Marwan Aljijakli · AI & Data Engineer · CTO at BOHIO",
    "مروان الجيجكلي · مهندس ذكاء اصطناعي وبيانات · المدير التقني في BOHIO"
  ),
  title: text(
    "I build AI systems from prototype to production.",
    "أبني أنظمة ذكاء اصطناعي من النموذج الأولي إلى التشغيل الفعلي."
  ),
  lead: text(
    "Based in Jeddah, Saudi Arabia, I work across AI engineering, data engineering, backend software, computer vision and embedded systems. I currently lead BOHIO’s technology and product architecture.",
    "أعمل من جدة، السعودية، في هندسة الذكاء الاصطناعي والبيانات والبرمجيات الخلفية والرؤية الحاسوبية والأنظمة المضمنة. وأقود حاليًا التقنية ومعمارية المنتج في BOHIO."
  ),
  primaryCta: text("Explore selected work", "استعرض الأعمال المختارة"),
  secondaryCta: text("Download CV", "تحميل السيرة الذاتية"),
  portraitAlt: text("Portrait of Marwan Aljijakli", "صورة مروان الجيجكلي"),
} as const;

export const work = {
  eyebrow: text("Selected work", "أعمال مختارة"),
  title: text(
    "Selected work across AI, data and connected systems.",
    "أعمال مختارة في الذكاء الاصطناعي والبيانات والأنظمة المتصلة."
  ),
  intro: text(
    "Each case explains the problem, my responsibility and the technical path to a working product. Public links are included where available.",
    "يوضح كل مشروع المشكلة، ومسؤوليتي، والمسار التقني الذي قاد إلى منتج يعمل. أدرجت الروابط العامة حيثما كانت متاحة."
  ),
  cases: [
    {
      number: "01",
      company: "BOHIO",
      kind: text("Current · Product architecture", "حاليًا · معمارية المنتج"),
      title: text(
        "AI-assisted financial modeling built around real Excel workflows.",
        "نمذجة مالية مدعومة بالذكاء الاصطناعي، مبنية حول مسارات العمل الحقيقية في Excel."
      ),
      description: text(
        "At BOHIO, I lead the architecture and hands-on delivery of a real-estate financial-modeling platform. My work spans the calculation engine, Excel workflows, secure APIs, bilingual UX, administration, telemetry, testing and controlled releases.",
        "في BOHIO، أقود معمارية منصة للنمذجة المالية العقارية وتنفيذها عمليًا. يمتد عملي من محرك الحساب ومسارات ملفات Excel إلى واجهات API الآمنة، وتجربة الاستخدام ثنائية اللغة، والإدارة، والقياس التشغيلي، والاختبارات، والإصدارات المنضبطة."
      ),
      facts: [
        text("Calculation engine and Excel workflows", "محرك الحساب ومسارات Excel"),
        text("Secure data access and product APIs", "وصول آمن للبيانات وواجهات API للمنتج"),
        text("Bilingual product, testing and release controls", "منتج ثنائي اللغة واختبارات وضوابط إصدار"),
      ],
      stack: ["Next.js", "TypeScript", "PostgreSQL", "Supabase", "ExcelJS"],
      links: [
        {
          href: "https://bohiotech.com",
          label: text("Visit BOHIO", "زيارة BOHIO"),
          external: true,
        },
      ] as ProjectLink[],
      visual: {
        type: "image",
        src: text("/projects/bohio-platform.webp", "/projects/bohio-platform.webp"),
        alt: text("BOHIO public product homepage", "الصفحة العامة لمنتج BOHIO"),
        browserLabel: text("bohiotech.com", "bohiotech.com"),
        width: 1280,
        height: 888,
      } satisfies ProjectImage,
    },
    {
      number: "02",
      company: "VLEED",
      kind: text("2024—2025 · Computer vision", "2024—2025 · رؤية حاسوبية"),
      title: text("Estimating heart rate from facial video.", "تقدير معدل نبض القلب من فيديو الوجه."),
      description: text(
        "At VLEED, I productized an open-source rPPG/POS pipeline as a Dockerized FastAPI service. It combines face-region segmentation, POS signal extraction and FFT analysis behind a production API.",
        "في VLEED، حوّلت مسار rPPG/POS مفتوح المصدر إلى خدمة FastAPI تعمل داخل Docker. تجمع الخدمة بين تحديد منطقة الوجه، واستخراج الإشارة بخوارزمية POS، وتحليل FFT ضمن واجهة جاهزة للاستخدام الإنتاجي."
      ),
      facts: [
        text("Face-region segmentation", "تحديد منطقة الوجه"),
        text("POS signal extraction and FFT analysis", "استخراج إشارة POS وتحليل FFT"),
        text("Dockerized FastAPI service", "خدمة FastAPI داخل Docker"),
      ],
      stack: ["Python", "PyTorch", "OpenCV", "FastAPI", "Docker"],
      links: [] as ProjectLink[],
      visual: { type: "video", asset: media.rppg } satisfies ProjectVideo,
    },
    {
      number: "03",
      company: "BLUECARE",
      kind: text("Public product · Bilingual AAC", "منتج عام · تواصل بديل ثنائي اللغة"),
      title: text(
        "Communication support designed for children, families and therapists.",
        "دعم تواصل مخصص للطفل والأسرة والمعالج."
      ),
      description: text(
        "BlueCare is a free, bilingual AAC web app for non-verbal and minimally verbal children with autism. Children communicate through picture boards, while caregivers and therapists use dedicated progress and support tools.",
        "BlueCare تطبيق ويب مجاني ثنائي اللغة للتواصل المعزّز والبديل، مخصص للأطفال ذوي التوحّد من غير الناطقين أو محدودي النطق. يستخدم الأطفال لوحات مصوّرة للتواصل، بينما تتوفر للأسر والمعالجين أدوات مستقلة للمتابعة والدعم."
      ),
      facts: [
        text("Dedicated child, caregiver and therapist flows", "مسارات مستقلة للطفل والأسرة والمعالج"),
        text("English and Arabic product interfaces", "واجهات منتج بالعربية والإنجليزية"),
        text("Public application and source code", "تطبيق عام وشيفرة مصدرية متاحة"),
      ],
      stack: ["Next.js", "TypeScript", "PostgreSQL", "RTL", "Accessibility"],
      links: [
        {
          href: text("https://bcare-ten.vercel.app/en", "https://bcare-ten.vercel.app/ar"),
          label: text("Open BlueCare", "فتح BlueCare"),
          external: true,
        },
        {
          href: "https://github.com/MarwanAljijakli/Bcare",
          label: text("View source", "عرض المصدر"),
          external: true,
        },
      ] as ProjectLink[],
      visual: {
        type: "image",
        src: text("/projects/bluecare-en.webp", "/projects/bluecare-ar.webp"),
        alt: text("BlueCare bilingual AAC product interface", "واجهة تطبيق BlueCare للتواصل المعزّز والبديل"),
        browserLabel: text("bcare-ten.vercel.app/en", "bcare-ten.vercel.app/ar"),
        width: 1280,
        height: 888,
      } satisfies ProjectImage,
    },
    {
      number: "04",
      company: "WATHBA",
      kind: text("Edge, cloud and telemetry", "الحافة والسحابة والقياس التشغيلي"),
      title: text(
        "Reliable device monitoring from firmware to dashboard.",
        "مراقبة موثوقة للأجهزة من البرنامج الثابت إلى لوحة المتابعة."
      ),
      description: text(
        "Wathba connects ESP32 firmware and NVS configuration to authenticated HTTPS telemetry, Supabase, Vercel and a dashboard that distinguishes live, stale and offline devices while exposing diagnostics.",
        "يربط Wathba برمجيات ESP32 وإعدادات NVS بإرسال HTTPS موثّق إلى Supabase وVercel، ثم يوضح في لوحة المتابعة ما إذا كان الجهاز متصلًا أو توقفت بياناته عن التحديث أو انقطع، مع معلومات للتشخيص."
      ),
      facts: [
        text("Authenticated ESP32 telemetry", "قياس موثّق من ESP32"),
        text("Live, stale and offline state handling", "معالجة حالات الاتصال والتقادم والانقطاع"),
        text("Firmware-to-dashboard diagnostics", "تشخيص من البرنامج الثابت إلى لوحة المتابعة"),
      ],
      stack: ["ESP32", "NVS", "HTTPS", "Supabase", "Vercel"],
      links: [
        {
          href: "https://energytovalue.com/app/ai-router",
          label: text("Open live telemetry view", "فتح واجهة القياس الحية"),
          external: true,
        },
      ] as ProjectLink[],
      visual: {
        type: "image",
        src: text("/projects/wathba-router.webp", "/projects/wathba-router.webp"),
        alt: text("Wathba energy telemetry and AI routing dashboard", "لوحة Wathba لقياس الطاقة والتوجيه الذكي"),
        browserLabel: text("energytovalue.com/app/ai-router", "energytovalue.com/app/ai-router"),
        width: 1280,
        height: 888,
      } satisfies ProjectImage,
    },
  ],
} as const;

export const approach = {
  eyebrow: text("Engineering approach", "منهجية العمل"),
  title: text(
    "What it takes to ship a dependable AI product.",
    "ما يحتاجه منتج ذكاء اصطناعي موثوق للوصول إلى التشغيل."
  ),
  intro: text(
    "Model accuracy is only one part. Reliable products also need sound data, secure services, usable workflows and controlled operations.",
    "دقة النموذج جزء واحد فقط؛ فالمنتج الموثوق يحتاج أيضًا إلى بيانات سليمة، وخدمات آمنة، ومسارات استخدام واضحة، وتشغيل منضبط."
  ),
  start: text("Prototype", "نموذج أولي"),
  end: text("Production", "تشغيل فعلي"),
  steps: [
    {
      number: "01",
      title: text("AI & signal processing", "الذكاء الاصطناعي ومعالجة الإشارات"),
      detail: text("Turn images, video and sensor readings into useful signals.", "تحويل الصور والفيديو وقراءات الحساسات إلى إشارات مفيدة."),
    },
    {
      number: "02",
      title: text("Data foundations", "أساس البيانات"),
      detail: text("Define schemas, transformations and checks that protect integrity.", "تعريف المخططات والتحويلات والفحوصات التي تحمي سلامة البيانات."),
    },
    {
      number: "03",
      title: text("Backend & security", "الأنظمة الخلفية والأمان"),
      detail: text("Expose the work through authenticated services and clear boundaries.", "تقديم العمل عبر خدمات موثّقة وحدود واضحة للصلاحيات."),
    },
    {
      number: "04",
      title: text("Product experience", "تجربة المنتج"),
      detail: text("Design workflows that make complex decisions understandable.", "تصميم مسارات تجعل القرارات المعقدة مفهومة وقابلة للاستخدام."),
    },
    {
      number: "05",
      title: text("Quality & operations", "الجودة والتشغيل"),
      detail: text("Test, release, observe and recover without guesswork.", "الاختبار والإصدار والمراقبة والاستعادة دون تخمين."),
    },
  ],
} as const;

export const experience = {
  eyebrow: text("Professional experience", "الخبرة المهنية"),
  title: text(
    "Professional experience in AI and product engineering.",
    "خبرة مهنية في هندسة الذكاء الاصطناعي والمنتجات."
  ),
  intro: text(
    "Hands-on roles spanning applied AI services, software architecture and the responsibility of operating what gets shipped.",
    "أدوار تنفيذية تجمع بين خدمات الذكاء الاصطناعي التطبيقية، ومعمارية البرمجيات، ومسؤولية تشغيل ما يصل إلى المستخدم."
  ),
  roles: [
    {
      company: "BOHIO",
      role: text("Chief Technology Officer · Hands-on Technical Lead", "المدير التقني · قائد تقني تنفيذي"),
      date: text("Jan 2026 — Present", "يناير 2026 — الآن"),
      current: true,
      summary: text(
        "Lead product architecture and hands-on delivery across the calculation engine, backend, data, bilingual UX, administration, testing and release controls.",
        "أقود معمارية المنتج وتنفيذه عمليًا عبر محرك الحساب، والأنظمة الخلفية، والبيانات، وتجربة الاستخدام ثنائية اللغة، والإدارة، والاختبارات، وضوابط الإصدار."
      ),
      stack: ["Next.js", "TypeScript", "Supabase", "PostgreSQL", "ExcelJS"],
    },
    {
      company: "VLEED",
      role: text("AI Engineer", "مهندس ذكاء اصطناعي"),
      date: text("Jun 2024 — Dec 2025", "يونيو 2024 — ديسمبر 2025"),
      current: false,
      summary: text(
        "Built production services for computer vision, physiological signal processing and generative media using Python, PyTorch, FastAPI, OpenCV and Docker.",
        "بنيت خدمات إنتاجية للرؤية الحاسوبية ومعالجة الإشارات الفسيولوجية والوسائط التوليدية باستخدام Python وPyTorch وFastAPI وOpenCV وDocker."
      ),
      stack: ["Python", "PyTorch", "FastAPI", "OpenCV", "Docker"],
    },
  ],
} as const;

export const expertise = {
  eyebrow: text("Technical expertise", "الخبرات التقنية"),
  title: text(
    "Technical expertise, organized by the problems it solves.",
    "خبرات تقنية مصنّفة بحسب المشكلات التي تحلها."
  ),
  intro: text(
    "The stack changes with the problem. These are the areas I use repeatedly to move from research and prototypes to dependable products.",
    "تتغير الأدوات بحسب المشكلة. وهذه المجالات هي التي أستخدمها باستمرار للانتقال من البحث والنماذج الأولية إلى منتجات يمكن الاعتماد عليها."
  ),
  groups: [
    {
      number: "01",
      title: text("AI, computer vision & signals", "الذكاء الاصطناعي والرؤية والإشارات"),
      detail: text("Build and serve vision models, physiological-signal pipelines and image-processing systems.", "بناء وتشغيل نماذج الرؤية ومسارات الإشارات الفسيولوجية وأنظمة معالجة الصور."),
      items: ["Python", "PyTorch", "OpenCV", "rPPG/POS", "FFT", "LinkNet"],
    },
    {
      number: "02",
      title: text("Generative AI & LLM systems", "الذكاء التوليدي وأنظمة النماذج اللغوية"),
      detail: text("Connect language models to guarded tools, documents and business workflows.", "ربط النماذج اللغوية بأدوات ووثائق ومسارات عمل محكومة."),
      items: ["OpenAI", "Anthropic", "Tool calling", "RAG", "Evaluation"],
    },
    {
      number: "03",
      title: text("Backend & data engineering", "الأنظمة الخلفية وهندسة البيانات"),
      detail: text("Design typed services, relational data models and permission-aware APIs.", "تصميم خدمات محددة الأنواع ونماذج بيانات علائقية وواجهات تراعي الصلاحيات."),
      items: ["Next.js", "TypeScript", "FastAPI", "PostgreSQL", "Supabase", "RLS"],
    },
    {
      number: "04",
      title: text("Cloud, quality & delivery", "السحابة والجودة والتسليم"),
      detail: text("Automate tests and releases, inspect failures and keep production observable.", "أتمتة الاختبارات والإصدارات، وتشخيص الأعطال، وإبقاء بيئة الإنتاج قابلة للمراقبة."),
      items: ["Docker", "GitHub Actions", "Playwright", "Vitest", "Vercel", "Sentry"],
    },
    {
      number: "05",
      title: text("Embedded systems & IoT", "الأنظمة المضمنة وإنترنت الأشياء"),
      detail: text("Move trustworthy telemetry from firmware and sensors to cloud decisions.", "نقل قياسات موثوقة من البرامج الثابتة والحساسات إلى قرارات سحابية."),
      items: ["ESP32", "STM32", "FreeRTOS", "MQTT", "BLE", "I2C/SPI"],
    },
  ],
} as const;

export const recognition = {
  eyebrow: text("Recognition & credentials", "الجوائز والمؤهلات"),
  title: text(
    "Awards, education and professional registration.",
    "الجوائز والتعليم والتسجيل المهني."
  ),
  intro: text(
    "First-place awards in aerial engineering and programming, third place in a Saudi AI hackathon, and active membership in the Saudi Council of Engineers.",
    "مركزان أولان في الهندسة الجوية والبرمجة، ومركز ثالث في هاكاثون سعودي للذكاء الاصطناعي، وعضوية سارية في الهيئة السعودية للمهندسين."
  ),
  awards: [
    {
      place: text("First place", "المركز الأول"),
      title: text("SAQIR Saudi Aerial Quadcopter Engineering Race", "سباق صقر السعودي لهندسة الطائرات الرباعية"),
      meta: text("Drone Challenge · 2025", "تحدي الطائرات المسيّرة · 2025"),
    },
    {
      place: text("First place", "المركز الأول"),
      title: text("CPC Programming Problem-Solving Competition", "مسابقة CPC لحل مسائل البرمجة"),
      meta: text("Jeddah International College · Team award", "كلية جدة العالمية · جائزة فريق"),
    },
    {
      place: text("Third place", "المركز الثالث"),
      title: text("Taghna AI Hackathon", "هاكاثون تغنى للذكاء الاصطناعي"),
      meta: text("Saudi Arabia · 2025", "المملكة العربية السعودية · 2025"),
    },
  ],
  education: {
    label: text("Education", "التعليم"),
    gpaLabel: text("GPA", "المعدل التراكمي"),
    degree: text("B.Sc. Computer Science", "بكالوريوس علوم الحاسب"),
    specialization: text("Artificial Intelligence specialization", "تخصص الذكاء الاصطناعي"),
    institution: text("Jeddah International College · Expected 2026", "كلية جدة العالمية · متوقع 2026"),
    gpa: "4.35/5.0",
  },
  training: [
    text("SDAIA advanced AI and machine-learning curriculum", "برنامج متقدم في الذكاء الاصطناعي وتعلّم الآلة لدى سدايا"),
    text("KAUST applied AI research and engineering program", "برنامج كاوست التطبيقي في أبحاث وهندسة الذكاء الاصطناعي"),
  ],
  leadership: text(
    "President, SWAICY Club · Head of Student Affairs, Computer Science/IT",
    "رئيس نادي SWAICY · رئيس شؤون الطلاب في علوم الحاسب وتقنية المعلومات"
  ),
} as const;

export const contact = {
  eyebrow: text("Contact", "التواصل"),
  title: text("Let’s talk about what you are building.", "لنتحدث عن المشروع الذي تعمل عليه."),
  body: text(
    "If you need hands-on engineering across AI, data, backend, computer vision or embedded systems, send a short note about the problem and the outcome you need.",
    "إذا كنت تحتاج إلى تنفيذ عملي في الذكاء الاصطناعي أو البيانات أو الأنظمة الخلفية أو الرؤية الحاسوبية أو الأنظمة المضمنة، أرسل نبذة قصيرة عن المشكلة والنتيجة التي تريد الوصول إليها."
  ),
  linkedinLabel: text("LinkedIn", "LinkedIn"),
  githubLabel: text("GitHub", "GitHub"),
  phoneLabel: text("Call", "اتصال"),
} as const;

export const interfaceCopy = {
  skip: text("Skip to main content", "انتقل إلى المحتوى الرئيسي"),
  home: text("Back to top", "العودة إلى الأعلى"),
  language: text("العربية", "English"),
  languageLabel: text("View this page in Arabic", "عرض هذه الصفحة بالإنجليزية"),
  themeToLight: text("Switch to light theme", "التبديل إلى الوضع الفاتح"),
  menu: text("Open navigation", "فتح قائمة التنقل"),
  closeMenu: text("Close navigation", "إغلاق قائمة التنقل"),
  menuLabel: text("Primary navigation", "التنقل الرئيسي"),
  current: text("Current", "حاليًا"),
  privateWork: text("Private implementation", "تنفيذ خاص"),
  external: text("Opens in a new tab", "يفتح في علامة تبويب جديدة"),
  playVideo: text("Play visual", "تشغيل المشهد"),
  pauseVideo: text("Pause visual", "إيقاف المشهد مؤقتًا"),
  videoUnavailable: text("Visual could not be loaded", "تعذّر تحميل المشهد"),
  copyEmail: text("Copy email", "نسخ البريد"),
  copiedEmail: text("Email copied", "تم نسخ البريد"),
  copyFailed: text("Copy failed — use the email link", "تعذر النسخ — استخدم رابط البريد"),
} as const;
