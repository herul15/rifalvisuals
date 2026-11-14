import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Shared hosting limits processes and threads separately from available CPUs.
  experimental: {
    cpus: 1,
  },
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  allowedDevOrigins: ["*.trycloudflare.com", "localhost:3000"],
};

export default nextConfig;
