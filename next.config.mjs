/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  optimizeFonts: true,
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
    serverComponentsExternalPackages: ['sharp']
  },
  webpack: (config, { isServer }) => {
    // Reducir tamaño de JavaScript
    config.optimization.minimize = true;
    
    // Optimizar carga de módulos
    config.optimization.splitChunks = {
      chunks: 'all',
      maxInitialRequests: 3,
      minSize: 20000,
      maxSize: 250000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    };

    return config;
  },
  
  // Configuración de rendimiento
  performance: {
    hints: 'warning',
    maxEntrypointSize: 512000,
    maxAssetSize: 512000
  },

  // Optimizar carga de CSS
  sassOptions: {
    includePaths: ['./src/styles'],
  },

  // Configuración de imagen
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60
  }
};

export default nextConfig;
