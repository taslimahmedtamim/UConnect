import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/help',
        destination: '/feed?filter=help',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
