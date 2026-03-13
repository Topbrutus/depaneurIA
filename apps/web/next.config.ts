import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@depaneuria/types', '@depaneuria/utils'],
};

export default nextConfig;
