const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");

module.exports = {
  entry: "./src/index.js",

  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "[name].bundle.js",
    clean: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/template.html",
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
    ],
  },
};
