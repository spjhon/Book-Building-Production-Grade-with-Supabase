import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  redirects: async () => [
    {
      //esta esa una redicreecin para cuando se ejecuta el route sin javascritp, entonces este es el que hace la redireccion
      ///:tenant es un parámetro dinámico de ruta, igual que [tenant] en la carpeta app/. “Aquí va cualquier valor, captúralo y reutilízalo”.
      source: "/logout",
      destination: "/auth/logout",
      permanent: true,
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '**.miapp', // Esto permite cualquier subdominio de miapp
        port: '3000',
      },
    ],
  },
  
};

export default nextConfig;
