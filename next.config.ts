/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: false, // disables Turbopack
  },
};

module.exports = nextConfig;
