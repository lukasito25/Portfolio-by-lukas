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
  // The PDF renderer's `pdfkit` loads its built-in fonts through a package
  // `#imports` subpath — `require('#standard-fonts/Helvetica')` — which the
  // file tracer does not follow, so the lambda shipped without
  // `pdfkit/js/standard-fonts/` and every PDF download died at module load
  // with MODULE_NOT_FOUND. The templates and the embedded Geist are listed
  // too: they were traced by luck of a `process.cwd()` join, and a route that
  // needs a file on disk should say so rather than rely on that.
  outputFileTracingIncludes: {
    '/api/admin/brief/[id]/document': [
      './node_modules/pdfkit/js/standard-fonts/**',
      './node_modules/pdfkit/js/data/**',
      './templates/**',
    ],
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
