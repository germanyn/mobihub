// @ts-check

const slsw = require("serverless-webpack");
const path = require("path");

/** @type {import('webpack').Configuration} */
module.exports = {
  mode: slsw.lib.webpack.isLocal ? "development" : "production",
  target: "node",
  entry: slsw.lib.entries,
  resolve: {
    extensions: [".js", ".ts", ".json"],
    alias: {
      "@mobihub/core": path.resolve(__dirname, "../core"),
    },
  },
  output: {
    libraryTarget: "commonjs",
    path: path.join(__dirname, "./.webpack"),
    filename: "[name].js",
  },
  devtool: "source-map",
  externals: ["aws-sdk", 'chrome-aws-lambda'],
  stats: slsw.lib.webpack.isLocal ? "errors-only" : "normal",
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_module/,
        loader: "ts-loader",
        include: [path.resolve(__dirname), path.resolve(__dirname, "../core")],
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
};
