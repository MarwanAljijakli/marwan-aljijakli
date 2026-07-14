import { createHash } from "node:crypto";

const baseUrl = (process.env.SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
const expectedCvHash = "6E6529EA929C79B579B30478F3209FB4FD41B0CB2A4E1D864821C7D6B2F6AB81";
const results = [];

function check(condition, label, detail = "") {
  if (!condition) {
    throw new Error(`${label}${detail ? `: ${detail}` : ""}`);
  }
  results.push(`PASS  ${label}${detail ? ` — ${detail}` : ""}`);
}

async function fetchOk(path, expectedType) {
  const response = await fetch(`${baseUrl}${path}`, { redirect: "follow" });
  check(response.ok, `${path} responds`, `HTTP ${response.status}`);
  if (expectedType) {
    const type = response.headers.get("content-type") ?? "";
    check(type.includes(expectedType), `${path} content type`, type);
  }
  return response;
}

const pageResponse = await fetchOk("/", "text/html");
const html = await pageResponse.text();

check(/<html[^>]+lang="en"[^>]+dir="ltr"/i.test(html), "default document language and direction");
check((html.match(/<h1(?:\s|>)/gi) ?? []).length === 1, "single H1", "Marwan Aljijakli");
check(html.includes("AI &amp; Data Engineer") || html.includes("AI & Data Engineer"), "primary role is rendered");
check(html.includes("النموذج مجرد البداية"), "Arabic copy is server-rendered");
check(html.includes("Jan 2026") && html.includes("Jun 2024") && html.includes("Dec 2025"), "employment dates match the current CV");
check(html.includes("SAQIR") && html.includes("CPC") && html.includes("Taghna AI Hackathon"), "verified awards are rendered");
check(html.includes("4.35/5.0"), "verified GPA is rendered");
check(!/href=["']#["']/i.test(html), "no empty hash links");
check(!html.includes("800+"), "unsupported 800+ claim is absent");
check(!html.includes("94.2%"), "unsupported AURA metric is absent");
check(!html.includes("6 IEEE"), "unsupported publication count is absent");
const pictographs = (html.match(/\p{Extended_Pictographic}/gu) ?? []).filter(
  (character) => character !== "©"
);
check(pictographs.length === 0, "no emoji in rendered HTML");
check(html.includes('type="application/ld+json"'), "structured Person data is present");
check(html.includes('rel="canonical"'), "canonical URL is present");
check(html.includes('property="og:title"'), "Open Graph metadata is present");
check(html.includes('name="twitter:card"'), "Twitter card metadata is present");

check(pageResponse.headers.get("x-content-type-options") === "nosniff", "security header: nosniff");
check(pageResponse.headers.get("x-frame-options") === "DENY", "security header: frame deny");
check(Boolean(pageResponse.headers.get("strict-transport-security")), "security header: HSTS");

const cvResponse = await fetchOk("/marwan-cv.pdf", "application/pdf");
const cvHash = createHash("sha256")
  .update(Buffer.from(await cvResponse.arrayBuffer()))
  .digest("hex")
  .toUpperCase();
check(cvHash === expectedCvHash, "downloaded CV is the supplied July 2026 file", cvHash);

const portraitResponse = await fetchOk("/marwan-portrait.webp", "image/webp");
const portraitBytes = Buffer.from(await portraitResponse.arrayBuffer()).byteLength;
check(portraitBytes < 30_000, "portrait is lightweight", `${portraitBytes} bytes`);

const robotsResponse = await fetchOk("/robots.txt", "text/plain");
const robots = await robotsResponse.text();
check(robots.includes("Sitemap: https://marwan-aljijakli.com/sitemap.xml"), "robots points to production sitemap");

const sitemapResponse = await fetchOk("/sitemap.xml", "application/xml");
const sitemap = await sitemapResponse.text();
check(sitemap.includes("https://marwan-aljijakli.com"), "sitemap contains canonical URL");

const ogResponse = await fetchOk("/opengraph-image", "image/png");
const ogBytes = Buffer.from(await ogResponse.arrayBuffer()).byteLength;
check(ogBytes > 10_000, "Open Graph image renders", `${ogBytes} bytes`);

if (process.env.CHECK_EXTERNAL === "1") {
  for (const url of [
    "https://bcare-ten.vercel.app/en",
    "https://github.com/MarwanAljijakli/Bcare",
    "https://github.com/MarwanAljijakli/HoP",
  ]) {
    const response = await fetch(url, { redirect: "follow" });
    check(response.ok, "external project link", `${response.status} ${url}`);
  }
}

console.log(`Verified ${results.length} site contracts against ${baseUrl}`);
console.log(results.join("\n"));
