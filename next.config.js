import { join } from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Output configuration for Cloudflare Pages deployment
  output: 'export',
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
  
  // Set output file tracing root to avoid workspace detection warning
  outputFileTracingRoot: join(process.cwd()),

  // Image optimization - disabled for static export
  images: {
    unoptimized: true,
  },

  // Performance optimizations
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Production optimizations
  poweredByHeader: false,

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: ['react', 'react-dom'],
  },

  // Webpack configuration for optimization
  webpack: (config, { isServer, dev }) => {
    // Production optimizations
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            chunks: 'all',
            name: 'framework',
            test: /(?<!node_modules.*)[\\/]node_modules[\\/](react|react-dom|scheduler|prop-types|use-subscription)[\\/]/,
            priority: 40,
            enforce: true,
          },
          lib: {
            test(module) {
              return (
                module.size() > 160000 &&
                /node_modules[/\\]/.test(module.nameForCondition() || '')
              );
            },
            name: 'lib',
            priority: 30,
            minChunks: 1,
            reuseExistingChunk: true,
          },
          commons: {
            name: 'commons',
            minChunks: 2,
            priority: 20,
          },
          shared: {
            name: false,
            priority: 10,
            minChunks: 2,
            reuseExistingChunk: true,
          },
        },
        maxInitialRequests: 25,
        minSize: 20000,
      };
    }

    return config;
  },
};

export default nextConfig;