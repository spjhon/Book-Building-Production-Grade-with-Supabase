import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      source: "/logout",
      destination: "/auth/logout/api",
      permanent: true,
    },
  ],
};

export default nextConfig;
