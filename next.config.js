/**
 * NextJS Configuration
 * See: https://nextjs.org/docs/app/api-reference/next-config-js
 */
const nextConfig = {
  /* Production optimizations */
  poweredByHeader: false,
  reactStrictMode: true,

  /* Image optimization */
  images: {
    domains: ['avatars.githubusercontent.com', 'gitlab.com'],
    formats: ['image/avif', 'image/webp'],
  },

  /* Environment variables available on client */
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  /* Redirects */
  async redirects() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: true,
      },
    ];
  },

  /* Headers */
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
