import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Exclude cloudflare-api from TypeScript compilation
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: config => {
    // Exclude cloudflare-api from webpack processing
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/cloudflare-api/**'],
    }
    return config
  },
}

export default nextConfig
