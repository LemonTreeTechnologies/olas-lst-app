import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  env: {
    DEPLOYMENT: process.env.DEPLOYMENT,
  },
};

export default nextConfig;
