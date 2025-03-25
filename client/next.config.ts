import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.ya?ml$/,
      type: "json", // Required for Turbo Mode compatibility
      use: "yaml-loader",
    });
    return config;
  },
};

export default nextConfig;
