import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.ignoreWarnings = [/require\.extensions is not supported by webpack/];
    return config;
  }
};

export default nextConfig;
