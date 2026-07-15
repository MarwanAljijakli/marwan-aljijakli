import type { Metadata, Viewport } from "next";
import { latinFont } from "@/app/fonts";
import { interfaceCopy, localize } from "@/content/portfolio";
import {
  getSiteMetadata,
  getStructuredData,
  siteViewport,
  themeBootstrapScript,
} from "@/lib/site-metadata";
import "@/app/globals.css";

export const metadata: Metadata = getSiteMetadata("en");
export const viewport: Viewport = siteViewport;

export default function EnglishRootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      dir="ltr"
      data-locale="en"
      data-theme="dark"
      className={latinFont.variable}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootstrapScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(getStructuredData("en")) }}
        />
      </head>
      <body>
        <a className="skip-link" href="#main-content">
          {localize(interfaceCopy.skip, "en")}
        </a>
        {children}
      </body>
    </html>
  );
}
