const webpack = require("webpack");
const path = require("path");

module.exports = {
  devtool: "eval-source-map",
  entry: {
    agency: "./src/assets/javascript/agency.js"
  },
  output: {
    path: path.resolve(__dirname, "./public/dist"),
    filename: "./index.js"
  },
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    }]
  },
  devServer: {
    contentBase: path.resolve(__dirname, "./public")
  },
}