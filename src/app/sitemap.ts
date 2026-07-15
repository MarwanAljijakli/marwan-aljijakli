import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://marwan-aljijakli.com",
      lastModified: new Date("2026-07-15"),
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          en: "https://marwan-aljijakli.com",
          ar: "https://marwan-aljijakli.com/ar",
          "x-default": "https://marwan-aljijakli.com",
        },
      },
    },
    {
      url: "https://marwan-aljijakli.com/ar",
      lastModified: new Date("2026-07-15"),
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          en: "https://marwan-aljijakli.com",
          ar: "https://marwan-aljijakli.com/ar",
          "x-default": "https://marwan-aljijakli.com",
        },
      },
    },
  ];
}
