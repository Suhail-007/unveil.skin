import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    proxyTimeout: 5000,
  },
  serverExternalPackages: ['sequelize', 'pg', 'pg-hstore', 'sequelize-cli'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
