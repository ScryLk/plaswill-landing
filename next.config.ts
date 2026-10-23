import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // `standalone` reúne em `.next/standalone` o servidor e só as dependências
  // que ele realmente usa. É o que permite a imagem final rodar sem `node_modules`
  // e sem pnpm: o Dockerfile copia essa pasta e roda `node server.js`. Sem isto a
  // imagem precisaria levar o `node_modules` inteiro, inclusive as ferramentas
  // de build.
  output: "standalone",
  images: {
    // As fotos reais da fábrica, dos equipamentos e dos produtos entram em /public/images.
    // Enquanto não houver fotos, os cards de produto usam os desenhos técnicos em SVG.
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    // A listagem de notícias saiu: os doze posts vivem no carrossel da home,
    // e o arquivo separado repetia os mesmos cartões. O endereço antigo
    // continua valendo, apontando para a seção. `permanent: true` responde
    // 308, que os buscadores tratam como 301 e preserva o método da requisição.
    return [
      { source: "/noticias", destination: "/#noticias", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
        ],
      },
    ];
  },
};

export default nextConfig;
