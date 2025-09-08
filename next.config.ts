import type {NextConfig} from 'next';
require('dotenv').config({ path: './.env' });


const nextConfig: NextConfig = {
  webpack: (config) => {
    config.ignoreWarnings = [/require\.extensions is not supported by webpack/];
    return config;
  }
};

export default nextConfig;
