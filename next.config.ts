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
    // `rate-limiter-flexible` ships a Drizzle store that requires `drizzle-orm`
    // at module load. It is optional and unused here, but webpack still tries
    // to resolve it and every build warned "Module not found". Aliasing to
    // `false` tells webpack the module is intentionally absent.
    config.resolve.alias = {
      ...config.resolve.alias,
      'drizzle-orm': false,
    }
    return config
  },
}

export default nextConfig
