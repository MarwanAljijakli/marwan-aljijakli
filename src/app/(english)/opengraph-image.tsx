import { createOpenGraphImage } from "@/lib/open-graph-image";

export const alt = "Marwan Aljijakli — AI & Data Engineer in Saudi Arabia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createOpenGraphImage();
}
