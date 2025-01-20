/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@radix-ui/react-icons', 'lucide-react'],
    serverExternalPackages: ['sharp']
  },
  webpack: (config) => {
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

  // Optimizar carga de CSS
  sassOptions: {
    includePaths: ['./src/styles'],
  },

  // Configuración de imagen
  images: {
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  }
};

export default nextConfig;
