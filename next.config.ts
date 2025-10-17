// next.config.ts - Complete Image Optimization
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Image optimization for mobile-first
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Mobile-first device sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  webpack: (config) => {
    // Asset aliases
    config.resolve.alias["attached_assets"] = path.resolve("./public/attached_assets");
    config.resolve.alias["@assets"] = path.resolve("./public/attached_assets");

    // Better asset handling for mobile
    config.module.rules.push({
      test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            publicPath: '/_next/static/images/',
            outputPath: 'static/images/',
          },
        },
      ],
    });

    return config;
  },

  // Performance optimizations
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['lucide-react'],
  },
};

export default nextConfig;