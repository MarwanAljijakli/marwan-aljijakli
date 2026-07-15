import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Noto_Kufi_Arabic } from "next/font/google";
import { Bilingual } from "@/components/Bilingual";
import { interfaceCopy } from "@/content/portfolio";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-latin",
  display: "swap",
});

const notoArabic = Noto_Kufi_Arabic({
  subsets: ["arabic"],
  variable: "--font-arabic",
  display: "swap",
  preload: false,
});

const siteUrl = "https://marwan-aljijakli.com";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? siteUrl),
  title: {
    default: "Marwan Aljijakli — AI & Data Engineer | CTO",
    template: "%s · Marwan Aljijakli",
  },
  description:
    "AI & Data Engineer and hands-on CTO in Jeddah, building production systems across model inference, secure APIs, data architecture, testing and cloud delivery.",
  keywords: [
    "Marwan Aljijakli",
    "AI Engineer Jeddah",
    "Data Engineer Saudi Arabia",
    "Computer Vision Engineer",
    "Technical Lead",
    "CTO",
    "FastAPI",
    "PyTorch",
    "PostgreSQL",
    "Supabase",
    "Embedded Systems",
  ],
  authors: [{ name: "Marwan Aljijakli", url: siteUrl }],
  creator: "Marwan Aljijakli",
  publisher: "Marwan Aljijakli",
  applicationName: "Marwan Aljijakli Portfolio",
  category: "technology",
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "profile",
    url: siteUrl,
    siteName: "Marwan Aljijakli",
    title: "Marwan Aljijakli — AI & Data Engineer | CTO",
    description:
      "End-to-end technical ownership across AI, data, secure APIs and cloud delivery. Based in Jeddah, Saudi Arabia.",
    locale: "en_US",
    alternateLocale: ["ar_SA"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marwan Aljijakli — AI & Data Engineer | CTO",
    description:
      "Building production systems across model inference, data, APIs and cloud delivery.",
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#071715" },
    { media: "(prefers-color-scheme: light)", color: "#f1eee7" },
  ],
  colorScheme: "dark light",
};

const preferenceScript = `
(function () {
  var root = document.documentElement;
  root.classList.add('js');
  try {
    var storedLocale = localStorage.getItem('portfolio-locale');
    var locale = storedLocale === 'ar' ? 'ar' : 'en';
    root.dataset.locale = locale;
    root.lang = locale;
    root.dir = locale === 'ar' ? 'rtl' : 'ltr';

    var storedTheme = localStorage.getItem('portfolio-theme');
    var theme = storedTheme === 'light' || storedTheme === 'dark'
      ? storedTheme
      : (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    root.dataset.theme = theme;
    root.style.colorScheme = theme;
  } catch (error) {
    root.dataset.locale = 'en';
    root.dataset.theme = 'dark';
  }
})();`;

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Marwan Aljijakli",
  url: siteUrl,
  image: `${siteUrl}/marwan-portrait.webp`,
  email: "mailto:marwan2004000@gmail.com",
  telephone: "+966572221939",
  jobTitle: ["AI & Data Engineer", "Chief Technology Officer"],
  worksFor: {
    "@type": "Organization",
    name: "BOHIO",
  },
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Jeddah International College",
  },
  memberOf: {
    "@type": "Organization",
    name: "Saudi Council of Engineers",
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
  knowsAbout: [
    "Artificial Intelligence",
    "Data Engineering",
    "Computer Vision",
    "Signal Processing",
    "Backend Engineering",
    "Embedded Systems",
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-locale="en"
      data-theme="dark"
      className={`${bricolage.variable} ${notoArabic.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: preferenceScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          <Bilingual text={interfaceCopy.skip} />
        </a>
        {children}
      </body>
    </html>
  );
}
