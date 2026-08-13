import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Permite importar diretamente o código-fonte TypeScript do pacote de
  // workspace @beautyflow/shared-types (não publicado/buildado em dist/),
  // já que por padrão o Next.js não transpila pacotes vindos de node_modules
  // (mesmo quando são symlinks de workspace, como aqui).
  transpilePackages: ["@beautyflow/shared-types"],
};

export default nextConfig;
