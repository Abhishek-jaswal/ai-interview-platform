/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      canvas: false,
      fs: false,
      path: false,
    };
    return config;
  },
};

export default nextConfig;