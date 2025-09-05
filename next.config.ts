import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript errors during builds
    ignoreBuildErrors: true,
  },
  experimental: {
    // Enable modern bundling
    optimizePackageImports: ["@radix-ui/react-icons"],
  },
};

export default nextConfig;