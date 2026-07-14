import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Marwan Aljijakli — AI & Data Engineer",
    short_name: "Marwan Aljijakli",
    description: "Portfolio of Marwan Aljijakli, AI & Data Engineer and CTO in Jeddah.",
    start_url: "/",
    display: "standalone",
    background_color: "#0c0e0c",
    theme_color: "#0c0e0c",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
