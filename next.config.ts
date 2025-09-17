import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
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
};

export default nextConfig;
