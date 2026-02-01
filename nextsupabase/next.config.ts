import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      //esta esa una redicreecin para cuando se ejecuta el route sin javascritp, entonces este es el que hace la redireccion
      source: "/logout",
      destination: "/auth/logout/api",
      permanent: true,
    },
  ],
};

export default nextConfig;
