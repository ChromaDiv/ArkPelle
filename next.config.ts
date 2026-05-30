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
      // Supabase Storage — product-images bucket
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  serverExternalPackages: [],
  allowedDevOrigins: ["192.168.18.135", "localhost:3000", "10.10.0.53"],
};

export default nextConfig;
