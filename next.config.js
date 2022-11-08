/** @type {import('next').NextConfig} */
const nodeExternals = require('webpack-node-externals');

module.exports = {
  reactStrictMode: true,
  webpack: (config, { isServer, webpack }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    config.externals = [nodeExternals()]

    return config;
  },
}
