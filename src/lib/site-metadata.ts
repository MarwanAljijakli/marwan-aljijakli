import type { Metadata, Viewport } from "next";
import type { Locale } from "@/content/portfolio";

export const siteUrl = "https://marwan-aljijakli.com";

const metadataCopy = {
  en: {
    title: "Marwan Aljijakli | AI & Data Engineer in Saudi Arabia",
    description:
      "Marwan Aljijakli is an AI and data engineer in Jeddah, Saudi Arabia, building computer-vision, backend, cloud and embedded systems from prototype to production.",
    locale: "en_US",
    path: "/",
  },
  ar: {
    title: "مروان الجيجكلي | مهندس ذكاء اصطناعي وبيانات في السعودية",
    description:
      "مروان الجيجكلي مهندس ذكاء اصطناعي وبيانات في جدة، السعودية، يبني أنظمة للرؤية الحاسوبية والبرمجيات الخلفية والسحابة والأنظمة المضمنة من النموذج الأولي إلى التشغيل.",
    locale: "ar_SA",
    path: "/ar",
  },
} as const;

export function getSiteMetadata(locale: Locale): Metadata {
  const copy = metadataCopy[locale];

  return {
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? siteUrl),
    title: copy.title,
    description: copy.description,
    authors: [{ name: "Marwan Aljijakli", url: siteUrl }],
    creator: "Marwan Aljijakli",
    publisher: "Marwan Aljijakli",
    applicationName: "Marwan Aljijakli Portfolio",
    category: "technology",
    alternates: {
      canonical: copy.path,
      languages: {
        en: "/",
        ar: "/ar",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "profile",
      url: copy.path,
      siteName: "Marwan Aljijakli",
      title: copy.title,
      description: copy.description,
      locale: copy.locale,
      alternateLocale: [locale === "ar" ? "en_US" : "ar_SA"],
      ...(locale === "ar"
        ? {
            images: [
              {
                url: "/opengraph-ar.png",
                width: 1200,
                height: 630,
                alt: "مروان الجيجكلي — مهندس ذكاء اصطناعي وبيانات في السعودية",
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      ...(locale === "ar" ? { images: ["/opengraph-ar.png"] } : {}),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export const siteViewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#071310" },
    { media: "(prefers-color-scheme: light)", color: "#f2eee5" },
  ],
  colorScheme: "dark light",
};

export const themeBootstrapScript = `
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  try {
    var storedTheme = localStorage.getItem('portfolio-theme');
    var theme = storedTheme === 'light' || storedTheme === 'dark'
      ? storedTheme
      : (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  } catch (error) {
    root.dataset.theme = 'dark';
  }
})();`;

export function getStructuredData(locale: Locale) {
  const pageUrl = locale === "ar" ? `${siteUrl}/ar` : siteUrl;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        url: siteUrl,
        name: "Marwan Aljijakli",
        alternateName: "مروان الجيجكلي",
        inLanguage: ["en", "ar"],
      },
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#profile-page`,
        url: pageUrl,
        name:
          locale === "ar"
            ? "الملف المهني لمروان الجيجكلي"
            : "Marwan Aljijakli professional profile",
        inLanguage: locale,
        isPartOf: { "@id": `${siteUrl}/#website` },
        mainEntity: { "@id": `${siteUrl}/#marwan` },
      },
      {
        "@type": "Person",
        "@id": `${siteUrl}/#marwan`,
        name: "Marwan Aljijakli",
        alternateName: "مروان الجيجكلي",
        url: siteUrl,
        image: `${siteUrl}/marwan-portrait.webp`,
        email: "mailto:marwan2004000@gmail.com",
        telephone: "+966572221939",
        jobTitle: ["AI & Data Engineer", "Chief Technology Officer"],
        worksFor: {
          "@type": "Organization",
          name: "BOHIO",
          url: "https://bohiotech.com",
        },
        memberOf: {
          "@type": "Organization",
          name: "Saudi Council of Engineers",
          url: "https://www.saudieng.sa/",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Jeddah",
          addressCountry: "SA",
        },
        sameAs: [
          "https://github.com/MarwanAljijakli",
          "https://www.linkedin.com/in/marwan-aljijakli-7ba965241/",
        ],
        knowsLanguage: ["Arabic", "English"],
        knowsAbout: [
          "Artificial intelligence engineering",
          "Data engineering",
          "Computer vision",
          "Physiological signal processing",
          "Backend software engineering",
          "Embedded systems",
          "Internet of Things",
        ],
      },
    ],
  };
}
