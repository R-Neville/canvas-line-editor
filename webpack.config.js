const path = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

const mode = process.env.NODE_ENV || "development";
const devtool = mode === "development" ? "eval-source-map" : ""; 

module.exports = {
  mode,
  devtool,
  devServer: {
    static:  path.resolve(__dirname, "dist"),
    compress: true,
    port: 3000,
  },
  entry: path.resolve(__dirname, "src", "index.ts"),
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.html"),
      inject: "body",
    }),
  ],
};
