/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["api.foodia-dev.nuncorp.id"],
  },
  reactStrictMode: true,
  devIndicators: {
    buildActivity: false,
  },
};

module.exports = nextConfig;
