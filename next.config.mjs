import { readFileSync } from 'fs';
import path from 'path';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning errors during production builds but don't fail
    ignoreDuringBuilds: process.env.NODE_ENV === 'development',
  },
  typescript: {
    // Only allow type errors to be ignored in development
    ignoreBuildErrors: process.env.NODE_ENV === 'development',
  },
  images: {
    remotePatterns: [
      {
        protocol: process.env.NODE_ENV === 'production' ? 'https' : 'http',
        hostname: process.env.NEXT_PUBLIC_DOMAIN || 'localhost',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: '**.amazonaws.com',
      }
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  webpack(config, { isServer }) {
    // Increase memory limit for webpack
    config.performance = {
      ...config.performance,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
      hints: 'warning',
    };

    // Handle JSON files more robustly
    config.module.rules.push({
      test: /\.json$/,
      type: 'javascript/auto',
      use: ['json-loader'],
    });

    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg")
    );

    config.module.rules.push(
      // Reapply the existing rule, but only for svg imports ending in ?url
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      // Convert all other *.svg imports to React components
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] }, // exclude if *.svg?url
        use: {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: {
                    overrides: {
                      removeViewBox: false,
                    },
                  },
                },
              ],
            },
          },
        },
      }
    );

    // Modify the file loader rule to ignore *.svg, since we have it handled now.
    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
  // Enable SWC minification
  swcMinify: true,
  // Cross-platform handling for environment variables and path separators
  env: {
    // Use forward slashes for paths in all environments
    APP_ENV: process.env.NODE_ENV || 'development',
    PATH_SEPARATOR: '/',
  },
  // Add trailing slashes for consistent URLs
  trailingSlash: true,
  // Enhanced handling for cross-platform paths in build output
  // for public assets and API routes
  crossOrigin: 'anonymous',
  
  // Production optimizations
  productionBrowserSourceMaps: false, // Disable source maps in production for better performance
  compress: true, // Enable gzip compression
  poweredByHeader: false, // Remove X-Powered-By header for security
  generateEtags: true, // Generate ETag headers for cache validation
};

export default nextConfig;
