import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://marwan-aljijakli.com/sitemap.xml",
    host: "https://marwan-aljijakli.com",
  };
}
