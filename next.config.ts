import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Export estático → genera carpeta out/ subible a Hostinger (sin Node).
  output: "export",
  // URLs como /nuestra-historia/ resuelven a index.html en Apache/estático.
  trailingSlash: true,
  images: {
    // Sin optimizador de Next: las WebP ya están optimizadas (q90) y así
    // funcionan en hosting estático (Hostinger) y sin fallos del optimizador.
    unoptimized: true,
  },
};

export default nextConfig;
