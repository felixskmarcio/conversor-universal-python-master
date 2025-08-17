import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Outras opções podem ser adicionadas aqui */
  async rewrites() {
    // Se a variável de ambiente estiver definida, redireciona chamadas locais
    // do frontend para o backend externo, evitando CORS em produção.
    if (process.env.NEXT_PUBLIC_API_URL) {
      return [
        {
          source: "/converter",
          destination: `${process.env.NEXT_PUBLIC_API_URL}/converter`,
        },
      ]
    }
    return []
  },
}

export default nextConfig;
