import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    domains: ['images.unsplash.com'],
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
    ignoreDuringBuilds: false,
    dirs: ['src', 'pages', 'components', 'lib', 'app'], // Only check specific directories
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
