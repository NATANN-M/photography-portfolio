import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

 // allowedDevOrigins: ['172.21.32.1'],
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**', // Allow all secure domains for flexibility
      },
    ],
  },
};

export default nextConfig;
