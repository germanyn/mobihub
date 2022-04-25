const path = require("path");

// next.config.js
const aliasPathsToResolve = [
  { name: "@mobihub/core", path: path.resolve(__dirname, "../core") },
];

/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
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
