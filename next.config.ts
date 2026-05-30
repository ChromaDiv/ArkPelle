import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "plus.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "obipelle.com",
        pathname: "/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  serverExternalPackages: [],
  allowedDevOrigins: ["192.168.18.135", "localhost:3000"],
};

export default nextConfig;
