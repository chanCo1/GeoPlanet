/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [],
  experimental: {
    optimizePackageImports: ["three"],
  },
};

module.exports = nextConfig;
