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

function count(source, pattern) {
  return (source.match(pattern) ?? []).length;
}

function metadataUrl(source, property) {
  const match = source.match(new RegExp(`<meta[^>]+property="${property}"[^>]+content="([^"]+)"`, "i"));
  check(Boolean(match), `${property} metadata URL is present`);
  return new URL(match[1].replaceAll("&amp;", "&"));
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

const englishResponse = await fetchOk("/", "text/html");
const english = await englishResponse.text();
const arabicResponse = await fetchOk("/ar", "text/html");
const arabic = await arabicResponse.text();

check(/<html[^>]+lang="en"[^>]+dir="ltr"/i.test(english), "English document language and direction");
check(/<html[^>]+lang="ar"[^>]+dir="rtl"/i.test(arabic), "Arabic document language and direction");
check(count(english, /<h1(?:\s|>)/gi) === 1, "English page has one H1");
check(count(arabic, /<h1(?:\s|>)/gi) === 1, "Arabic page has one H1");
check(english.includes("I build AI systems from prototype to production."), "English hero is direct and current");
check(arabic.includes("أبني أنظمة ذكاء اصطناعي من النموذج الأولي إلى التشغيل الفعلي."), "Arabic hero is direct and current");
check(english.includes("AI &amp; Data Engineer") || english.includes("AI & Data Engineer"), "primary role is rendered");

check(!english.includes("credential-rail") && !arabic.includes("credential-rail"), "orange credential rail is absent");
check(!english.includes("hero-proof") && !arabic.includes("hero-proof"), "redundant hero proof row is absent");
check(!english.includes("Two roles, both close to the code."), "old vague experience copy is absent");
check(!english.includes("Capabilities I use to carry a system end to end."), "old vague capability copy is absent");
check(!english.includes("Two first places, one third place"), "old list-like recognition copy is absent");
check(!english.includes("Designed and engineered in Jeddah."), "English footer tagline is absent");
check(!arabic.includes("صُمّم وطُوّر في جدة."), "Arabic footer tagline is absent");

check(english.includes("1272601") && english.includes("13 July 2027"), "English SCE membership is prominent");
check(arabic.includes("1272601") && arabic.includes("13 يوليو 2027"), "Arabic SCE membership is prominent");
check(english.includes("Jan 2026") && english.includes("Jun 2024") && english.includes("Dec 2025"), "employment dates match the CV");
check(english.includes("SAQIR") && english.includes("CPC") && english.includes("Taghna AI Hackathon"), "verified awards are rendered");
check(english.includes("4.35/5.0") && english.includes("Expected 2026"), "education status and GPA are precise");

check(english.includes('href="https://bohiotech.com"'), "BOHIO product link is present");
check(english.includes('href="https://bcare-ten.vercel.app/en"'), "BlueCare live link is present");
check(arabic.includes('href="https://bcare-ten.vercel.app/ar"'), "Arabic BlueCare link opens the Arabic product");
check(english.includes('href="https://energytovalue.com/app/ai-router"'), "Wathba live link is present");
check(count(english, /class="browser-frame"/g) === 3, "three projects use authentic product captures");
check(english.includes("BOHIO public product homepage"), "BOHIO capture has useful alternative text");
check(english.includes("BlueCare bilingual AAC product interface"), "BlueCare capture has useful alternative text");
check(arabic.includes("واجهة تطبيق BlueCare للتواصل المعزّز والبديل"), "Arabic BlueCare capture is localized");

check(count(english, /<figure[^>]+data-loop-media/gi) === 5, "five intentional video placements are rendered");
check(count(english, /<video[^>]+data-loop-video/gi) === 5, "five lazy looping videos are rendered");
check(count(english, /<source[^>]+data-src="\/media\/v2-[^"]+\.mp4"/gi) === 5, "video sources are deferred in server HTML");
check(!/<source[^>]+\ssrc=/i.test(english), "video binaries are absent from the initial request graph");
check(count(english, /data-media-variant="background"/gi) === 3, "three intentional section background animations are rendered");
check(english.includes("hero-background-media") && !english.includes("hero-visual"), "Hero no longer renders a standalone video column");
check(
  english.includes("recognition-background-media") &&
    english.includes("education-background-media") &&
    !english.includes("recognition-film") &&
    !english.includes("education-film"),
  "awards and certifications render only as section backgrounds"
);
check(count(english, /<figcaption class="media-caption"/gi) === 2, "background animations have no visible media captions");
check(count(english, /aria-label="MA — Back to top"/gi) === 2, "visible MA marks are included in their accessible names");
check(
  english.includes('aria-label="AR — View this page in Arabic"') &&
    arabic.includes('aria-label="EN — عرض هذه الصفحة بالإنجليزية"'),
  "visible language codes are included in their accessible names"
);

check(!/href=["']#["']/i.test(english), "no empty hash links");
check(!english.includes("800+") && !english.includes("94.2%") && !english.includes("6 IEEE"), "unsupported claims are absent");
const pictographs = (english.match(/\p{Extended_Pictographic}/gu) ?? []).filter((character) => character !== "©");
check(pictographs.length === 0, "no emoji in rendered HTML");

for (const type of ["WebSite", "ProfilePage", "Person"]) {
  check(english.includes(`\"@type\":\"${type}\"`), `structured ${type} data is present`);
}
check(english.includes('"url":"https://bohiotech.com"'), "structured data connects Marwan to BOHIO");
check(/rel="canonical" href="https:\/\/marwan-aljijakli\.com\/?"/i.test(english), "English self-canonical is present");
check(/rel="canonical" href="https:\/\/marwan-aljijakli\.com\/ar"/i.test(arabic), "Arabic self-canonical is present");
for (const locale of ["en", "ar", "x-default"]) {
  check(new RegExp(`hreflang="${locale}"`, "i").test(english), `English page exposes ${locale} hreflang`);
  check(new RegExp(`hreflang="${locale}"`, "i").test(arabic), `Arabic page exposes ${locale} hreflang`);
}
check(english.includes('property="og:title"') && english.includes('name="twitter:card"'), "social metadata is present");

for (const [label, response] of [
  ["English", englishResponse],
  ["Arabic", arabicResponse],
]) {
  check(response.headers.get("x-content-type-options") === "nosniff", `${label} security header: nosniff`);
  check(response.headers.get("x-frame-options") === "DENY", `${label} security header: frame deny`);
  check(Boolean(response.headers.get("strict-transport-security")), `${label} security header: HSTS`);
}

const cvResponse = await fetchOk("/marwan-cv.pdf", "application/pdf");
const cvHash = createHash("sha256")
  .update(Buffer.from(await cvResponse.arrayBuffer()))
  .digest("hex")
  .toUpperCase();
check(cvHash === expectedCvHash, "downloaded CV is the supplied July 2026 file", cvHash);

const portraitResponse = await fetchOk("/marwan-portrait.webp", "image/webp");
const portraitBytes = Buffer.from(await portraitResponse.arrayBuffer()).byteLength;
check(portraitBytes < 30_000, "portrait is lightweight", `${portraitBytes} bytes`);

const runtimeResponse = await fetchOk("/portfolio-runtime-v5.js", "application/javascript");
const runtimeSource = await runtimeResponse.text();
check(runtimeSource.length > 5_000 && runtimeSource.length < 20_000, "interaction runtime stays compact", `${runtimeSource.length} characters`);
check(
  runtimeSource.includes("data-loop-media") &&
    runtimeSource.includes("portfolio-theme") &&
    runtimeSource.includes("data-menu-summary"),
  "runtime contains media, theme and navigation controls"
);
check(!runtimeSource.includes("portfolio-locale"), "locale routing does not depend on local storage");
check(
  runtimeSource.includes("autoplayAllowedFor") && runtimeSource.includes('media.dataset.mediaVariant === "background"'),
  "compact screens allow intentional background animations to autoplay"
);
check(
  runtimeSource.includes("userPaused") && runtimeSource.includes("userStarted"),
  "manual media choices survive visibility updates"
);
check(runtimeResponse.headers.get("cache-control")?.includes("immutable"), "interaction runtime has immutable caching");

const projectBudgets = [
  ["/projects/bohio-platform.webp", 80_000],
  ["/projects/bluecare-en.webp", 80_000],
  ["/projects/bluecare-ar.webp", 80_000],
  ["/projects/wathba-router.webp", 80_000],
];
let totalProjectBytes = 0;
for (const [path, budget] of projectBudgets) {
  const response = await fetchOk(path, "image/webp");
  const bytes = Buffer.from(await response.arrayBuffer()).byteLength;
  totalProjectBytes += bytes;
  check(bytes < budget, `${path} stays lightweight`, `${bytes} bytes`);
  check(response.headers.get("cache-control")?.includes("immutable"), `${path} has immutable caching`);
}
check(totalProjectBytes < 200_000, "combined project captures stay below 200 KB", `${totalProjectBytes} bytes`);

const mediaBudgets = [
  ["/media/v2-introduction.mp4", 1_600_000],
  ["/media/v2-rppg.mp4", 1_100_000],
  ["/media/v2-awards.mp4", 800_000],
  ["/media/v2-certifications.mp4", 600_000],
  ["/media/v2-contact.mp4", 600_000],
];
let totalMediaBytes = 0;
for (const [path, budget] of mediaBudgets) {
  const response = await fetchOk(path, "video/mp4");
  const bytes = Buffer.from(await response.arrayBuffer()).byteLength;
  totalMediaBytes += bytes;
  check(bytes < budget, `${path} stays within its transfer budget`, `${bytes} bytes`);
  check(response.headers.get("cache-control")?.includes("immutable"), `${path} has immutable caching`);
}
check(totalMediaBytes < 4_500_000, "combined optimized videos stay below 4.5 MB", `${totalMediaBytes} bytes`);

for (const path of [
  "/media/v2-introduction-poster.webp",
  "/media/v2-rppg-poster.webp",
  "/media/v2-awards-poster.webp",
  "/media/v2-certifications-poster.webp",
  "/media/v2-contact-poster.webp",
]) {
  const response = await fetchOk(path, "image/webp");
  const bytes = Buffer.from(await response.arrayBuffer()).byteLength;
  check(bytes < 70_000, `${path} poster stays lightweight`, `${bytes} bytes`);
}

const robotsResponse = await fetchOk("/robots.txt", "text/plain");
const robots = await robotsResponse.text();
check(robots.includes("Sitemap: https://marwan-aljijakli.com/sitemap.xml"), "robots points to production sitemap");

const sitemapResponse = await fetchOk("/sitemap.xml", "application/xml");
const sitemap = await sitemapResponse.text();
check(sitemap.includes("https://marwan-aljijakli.com/ar"), "sitemap contains the Arabic URL");
check(sitemap.includes('hreflang="en"') && sitemap.includes('hreflang="ar"'), "sitemap contains localized alternates");
check(sitemap.includes('hreflang="x-default"'), "sitemap contains the default-language alternate");

for (const [source, label] of [
  [english, "English"],
  [arabic, "Arabic"],
]) {
  const imageUrl = metadataUrl(source, "og:image");
  const path = `${imageUrl.pathname}${imageUrl.search}`;
  const response = await fetchOk(path, "image/png");
  const bytes = Buffer.from(await response.arrayBuffer()).byteLength;
  check(bytes > 10_000, `${label} social image renders`, `${bytes} bytes`);
  if (label === "Arabic") {
    check(path.startsWith("/opengraph-ar.png"), "Arabic metadata uses the localized social image");
    check(bytes < 200_000, "Arabic social image stays lightweight", `${bytes} bytes`);
    check(response.headers.get("cache-control")?.includes("immutable"), "Arabic social image has immutable caching");
  }
}

if (process.env.CHECK_EXTERNAL === "1") {
  for (const url of [
    "https://bohiotech.com",
    "https://bcare-ten.vercel.app/en",
    "https://github.com/MarwanAljijakli/Bcare",
    "https://energytovalue.com/app/ai-router",
  ]) {
    const response = await fetch(url, { redirect: "follow" });
    check(response.ok, "external project link", `${response.status} ${url}`);
  }
}

console.log(`Verified ${results.length} site contracts against ${baseUrl}`);
console.log(results.join("\n"));
