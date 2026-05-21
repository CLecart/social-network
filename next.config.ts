import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://res.cloudinary.com https://images.pexels.com https://demofree.sirv.com https://i.pinimg.com https://cdn.discordapp.com https://media.giphy.com https://media.tenor.com https://i.imgur.com",
      "font-src 'self'",
      "connect-src 'self' https://*.upstash.io https://api.cloudinary.com",
      "frame-ancestors 'none'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  /* config options here */
  images: {
    // In production inside the Bun-based container, Next/Image optimization can fail
    // (sharp/squoosh issues). Disable optimization in production to serve images directly.
    unoptimized: process.env.NODE_ENV === 'production',
    domains: [
      'images.pexels.com',
      'res.cloudinary.com',
      'demofree.sirv.com',
      'i.pinimg.com',
      'cdn.discordapp.com',
      // Ajouts pour contenus des posts/commentaires
      'media.giphy.com',
      'media.tenor.com',
      'i.imgur.com',
    ],
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  output: "standalone",
};

export default nextConfig;
