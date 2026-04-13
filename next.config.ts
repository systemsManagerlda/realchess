import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Configuração de imagens
  images: {
    // Qualidades de imagem suportadas
    qualities: [75, 90],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "drive.google.com",
      },
    ],
    
    // Formatos otimizados
    formats: ['image/avif', 'image/webp'],
    
    // Domínios permitidos (adicione se usar imagens externas)
    // domains: ["drive.google.com"],
    
    // Configuração de dispositivo para imagens responsivas
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // Compressão para produção
  compress: true,
  
  
  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;