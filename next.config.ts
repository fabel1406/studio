import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://dummy.url').hostname,
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
  experimental: {
    // This is to prevent the Edge Runtime warning from Supabase
    allowMiddlewareResponseBody: true, 
  },
  webpack: (config) => {
    config.ignoreWarnings = [/require\.extensions is not supported by webpack/];
    return config;
  },
};

export default nextConfig;
