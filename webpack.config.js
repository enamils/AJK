const path = require("path");
const webpack = require("webpack");
const WebpackBar = require('webpackbar');

const fs = require("fs");
const yaml = require("js-yaml");

function loadConfig() {
  let ymlFile = fs.readFileSync('config.yml', 'utf8');
  return yaml.load(ymlFile);
}

const {PATHS} = loadConfig();

module.exports = {
  devtool: "eval-source-map",
  entry: {
    vendor: PATHS.vendor,
    app: PATHS.javascript,
  },
  output: {
    path: path.resolve(__dirname, PATHS.dist),
    filename: "./js/[name].js"
  },
  plugins: [
    new WebpackBar(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, "./public")
  }
}