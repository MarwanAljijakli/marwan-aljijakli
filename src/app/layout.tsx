import type { Metadata, Viewport } from "next";
import { Inter, Space_Mono, Bebas_Neue } from "next/font/google";
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

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
  weight: "400",
});

/* -------------------------------------------------------------------------- */
/*  Metadata                                                                  */
/* -------------------------------------------------------------------------- */
export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://marwan.dev"
  ),
  title: {
    default:
      "Marwan Aljijakli — CTO & AI/ML Engineer | Jeddah, Saudi Arabia",
    template: "%s · Marwan Aljijakli",
  },
  description:
    "CTO and AI/ML Engineer specializing in Computer Vision, Generative AI, LLM Applications, and production-grade AI systems. Building rPPG health platforms, RAG pipelines, and industrial safety AI.",
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
    title: "Marwan Aljijakli — CTO & AI/ML Engineer",
    description:
      "Building AI that ships. From rPPG health systems to industrial safety AI.",
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Marwan Aljijakli",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Marwan Aljijakli — CTO & AI/ML Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marwan Aljijakli — CTO & AI/ML Engineer",
    description:
      "Building AI that ships. From rPPG health systems to industrial safety AI.",
    images: ["/og-image.jpg"],
  },
  alternates: {
    canonical: "/",
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
      className={`${inter.variable} ${spaceMono.variable} ${bebasNeue.variable}`}
      suppressHydrationWarning
    >
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
