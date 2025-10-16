// next.config.ts
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  webpack: (config) => {
    // Add alias so you can import from 'attached_assets/...'
    config.resolve.alias["attached_assets"] = path.resolve("./public/attached_assets");
    config.resolve.alias["@assets"] = path.resolve("./public/attached_assets"); // Add this line
    return config;
  },
};

export default nextConfig;
