import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono, Space_Grotesk } from "next/font/google";
import AppShell from "@/components/providers/AppShell";
import "./globals.css";

/* -------------------------------------------------------------------------- */
/*  Fonts                                                                     */
/* -------------------------------------------------------------------------- */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
  weight: ["400", "700"],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

/* -------------------------------------------------------------------------- */
/*  Metadata                                                                  */
/* -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://marwan-aljijakli.com"
  ),
  title: {
    default:
      "Marwan Aljijakli — AI/ML Engineer | Computer Vision | LLM & RAG Systems",
    template: "%s · Marwan Aljijakli",
  },
  description:
    "AI/ML Engineer and CTO with 3 production AI systems deployed. Specializing in Computer Vision (YOLO, OpenCV), LLM/RAG pipelines, and IoT. Based in Jeddah, Saudi Arabia. Available immediately.",
  keywords: [
    "AI Engineer",
    "ML Engineer",
    "CTO",
    "Computer Vision",
    "LLM",
    "RAG",
    "Generative AI",
    "Jeddah",
    "Saudi Arabia",
    "YOLO",
    "LangChain",
    "Docker",
    "FastAPI",
    "Marwan Aljijakli",
  ],
  authors: [{ name: "Marwan Aljijakli" }],
  creator: "Marwan Aljijakli",
  publisher: "Marwan Aljijakli",
  applicationName: "Marwan Aljijakli Portfolio",
  category: "technology",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
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
  openGraph: {
    title: "Marwan Aljijakli — AI/ML Engineer | Computer Vision | LLM & RAG Systems",
    description:
      "AI/ML Engineer and CTO with 3 production AI systems deployed. Specializing in Computer Vision, LLM/RAG pipelines, and IoT. Based in Jeddah, Saudi Arabia.",
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Marwan Aljijakli",
  },
  twitter: {
    card: "summary_large_image",
    title: "Marwan Aljijakli — AI/ML Engineer | Computer Vision | LLM & RAG Systems",
    description:
      "AI/ML Engineer and CTO with 3 production AI systems deployed. Specializing in Computer Vision, LLM/RAG, and IoT. Based in Jeddah, Saudi Arabia.",
  },
  alternates: {
    canonical: "https://marwan-aljijakli.com",
  },
};

export const viewport: Viewport = {
  themeColor: "#050A0F",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/* -------------------------------------------------------------------------- */
/*  Root layout                                                               */
/* -------------------------------------------------------------------------- */
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceMono.variable} ${spaceGrotesk.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Marwan Aljijakli",
              url: "https://marwan-aljijakli.com",
              email: "marwan2004000@gmail.com",
              telephone: "+966572221939",
              jobTitle: "AI/ML Engineer & CTO",
              worksFor: [
                { "@type": "Organization", name: "BOHIO" },
                { "@type": "Organization", name: "VLEED" },
              ],
              alumniOf: {
                "@type": "CollegeOrUniversity",
                name: "Jeddah International College",
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
            }),
          }}
        />
      </head>
      <body className="min-h-dvh bg-bg-primary text-text-primary antialiased selection:bg-accent-cyan selection:text-bg-primary">
        {/* Skip to main content — hidden until focused by keyboard. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[300] focus:rounded-full focus:bg-[color:var(--accent-primary)] focus:px-4 focus:py-2 focus:font-mono focus:text-[11px] focus:uppercase focus:tracking-[0.14em] focus:text-[color:var(--bg-primary)] focus:shadow-lg"
        >
          Skip to content
        </a>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
