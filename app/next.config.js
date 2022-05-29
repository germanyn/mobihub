// @ts-check

const path = require("path");

const aliasPathsToResolve = [
  { name: "@mobihub/core", path: path.resolve(__dirname, "../core") },
];

// @ts-ignore
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const configuration = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  target: 'serverless',
  compress: true,
  env: {
    MONGODB_URI: (/** @type {string} */(process.env.MONGODB_URI)),
  },
  webpack(config, { defaultLoaders }) {
    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      include: [path.resolve(__dirname, "../core")],
      use: [defaultLoaders.babel],
    });

    /** Resolve aliases */
    aliasPathsToResolve.forEach((module) => {
      config.resolve.alias[module.name] = module.path;
    });
    return config;
  },
  plugins: [["@babel/plugin-proposal-decorators", { legacy: true }]],
};

module.exports = withBundleAnalyzer(configuration);