/** @type {import('next').NextConfig} */
const nextConfig = {
  // Image Optimization
  images: {
    domains: ['cdn.sanity.io'],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60, // 1 minute cache for images
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Static Optimization
  staticPageGenerationTimeout: 60, // Increase timeout for static generation
  
  // Performance Headers
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'Server-Timing',
            value: 'edge;desc="Edge Response"',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // Webpack Configuration
  webpack: (config, { isServer }) => {
    // Minimize JavaScript
    config.optimization.minimize = true;

    // Reduce chunk size
    config.optimization.splitChunks = {
      chunks: 'all',
      maxSize: 250000, // 250kb
    };

    return config;
  },

  // Experimental features (simplified)
  experimental: {
    serverActions: true,
  },
}

module.exports = nextConfig;
