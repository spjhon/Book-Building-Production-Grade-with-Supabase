import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  redirects: async () => [
    {
      //esta esa una redicreecin para cuando se ejecuta el route sin javascritp, entonces este es el que hace la redireccion
      ///:tenant es un parámetro dinámico de ruta, igual que [tenant] en la carpeta app/. “Aquí va cualquier valor, captúralo y reutilízalo”.
      source: "/:tenant/logout",
      destination: "/:tenant/auth/logout",
      permanent: true,
    },
  ],
};

export default nextConfig;
