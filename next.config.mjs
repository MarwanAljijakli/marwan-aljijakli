/** @type {import('next').NextConfig} */

// Headers applied to every response. Tight defaults for a portfolio that
// doesn't embed third-party iframes and doesn't load user-uploaded media.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // next/image configuration. Extend `remotePatterns` if you later host
  // project screenshots or avatars on a CDN.
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Example once deployed:
      // { protocol: "https", hostname: "cdn.marwan.dev" },
    ],
  },

  // Faster `next build`: lean on SWC for both compilation and minification.
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? { exclude: ["error", "warn"] }
        : false,
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
