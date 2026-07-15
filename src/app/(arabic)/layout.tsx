import type { Metadata, Viewport } from "next";
import { arabicFont } from "@/app/arabic-font";
import { latinFont } from "@/app/fonts";
import { interfaceCopy, localize } from "@/content/portfolio";
import {
  getSiteMetadata,
  getStructuredData,
  siteViewport,
  themeBootstrapScript,
} from "@/lib/site-metadata";
import "@/app/globals.css";

export const metadata: Metadata = getSiteMetadata("ar");
export const viewport: Viewport = siteViewport;

export default function ArabicRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      data-locale="ar"
      data-theme="dark"
      className={`${latinFont.variable} ${arabicFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getStructuredData("ar")) }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          {localize(interfaceCopy.skip, "ar")}
        </a>
        {children}
      </body>
    </html>
  );
}
