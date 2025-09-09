import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  webpack: (config) => {
    config.ignoreWarnings = [/require\.extensions is not supported by webpack/];
    return config;
  },
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  }
};

export default nextConfig;
