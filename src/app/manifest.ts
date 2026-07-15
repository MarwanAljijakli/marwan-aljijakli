import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Marwan Aljijakli — AI & Data Engineer in Saudi Arabia",
    short_name: "Marwan Aljijakli",
    description:
      "Portfolio of Marwan Aljijakli, an AI and data engineer in Jeddah building production software, computer-vision, cloud and embedded systems.",
    start_url: "/",
    display: "standalone",
    background_color: "#071715",
    theme_color: "#071715",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
