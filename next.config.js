/** @type {import('next').NextConfig} */

module.exports = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, options) => {
    config.externals = {
      sharp: "commonjs sharp",
    };
    config.resolve.fallback = {
      fs: false,
      dns: false,
      tls: false,
      net: false,
      child_process: false,
      bson_ext: false,
      kerberos: false,
      snappy: false,
      aws4: false,
    };
    config.experiments = {
      topLevelAwait: true,
      layers: true,
    };
    return config;
  },
};
