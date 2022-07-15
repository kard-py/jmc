/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, options) => {
    config.resolve.fallback = { fs: false, dns: false, tls: false, net: false };
    config.experiments = {
      topLevelAwait: true,
      layers: true,
    };
    return config;
  },
};
