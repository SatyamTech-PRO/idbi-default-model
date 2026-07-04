import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://idbi-default-model.onrender.com/:path*",
      },
    ];
  },
};

export default nextConfig;
