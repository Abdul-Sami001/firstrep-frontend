// next.config.ts
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Add alias so you can import from 'attached_assets/...'
    config.resolve.alias["attached_assets"] = path.resolve("./public/attached_assets");
    return config;
  },
};

export default nextConfig;
