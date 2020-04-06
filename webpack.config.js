const path = require("path");
const webpack = require("webpack");
const glob = require("glob");
const WebpackBar = require('webpackbar');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
    bootstrapFontAwesome: PATHS.stylesheet.vendor,
    style: PATHS.stylesheet.css,
    images: glob.sync(PATHS.assets.images),
    fonts: glob.sync(PATHS.assets.fonts)
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
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    })
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
          },
          {
            loader: 'resolve-url-loader'
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|woff|woff2|svg)$/,
        exclude: [
          /images/,
        ],
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]'
        }
      },
      {
        test: /\.(png|jpg|gif|svg|JPG|PNG|ico)$/,
        exclude: [
          /fonts/,
        ],
        use: 'file-loader?name=/images/[folder]/[name].[ext]',
      },
    ]
  },
  devServer: {
    contentBase: path.resolve(__dirname, "./public")
  }
}