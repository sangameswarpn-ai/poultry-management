import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Allow leaflet images to load properly, map config, etc.
  images: {
    unoptimized: true,
  }
};

export default nextConfig;
