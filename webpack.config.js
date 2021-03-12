const path = require("path");
const webpack = require("webpack");
const glob = require("glob");
const WebpackBar = require('webpackbar');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const devMode = process.env.NODE_ENV !== 'production';
const fs = require("fs");
const yaml = require("js-yaml");
const smp = new SpeedMeasurePlugin();

function loadConfig() {
  let ymlFile = fs.readFileSync('config.yml', 'utf8');
  return yaml.load(ymlFile);
}

const {PATHS} = loadConfig();

const jsBuild = smp.wrap({
  devtool: devMode ? 'eval-cheap-module-source-map' : false,
  entry: {
    // JS
    vendor: PATHS.vendor,
    app: PATHS.javascript
  },
  output: {
    path: path.resolve(__dirname, PATHS.dist),
    filename: "js/[name].js",
    publicPath: "dist/"
  },
  devServer: {
    contentBase: path.resolve(__dirname, PATHS.dist),
    watchContentBase: true,
    historyApiFallback: true,
    compress: true,
    disableHostCheck: true
  },
  target: 'web',
  plugins: [
    new WebpackBar({
      name: "JS Build"
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.ejs'
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.ejs$/,
        loader: 'ejs-loader',
        options: {
          esModule: false
        }
      },
    ]
  }
});

const cssAssetsBuild = smp.wrap({
  devtool: devMode ? 'source-map' : false,
  entry: {
    // CSS
    bootstrapVendor: PATHS.stylesheet.bootstrapVendor,
    fontVendor: PATHS.stylesheet.fontVendor,
    app: PATHS.stylesheet.css,

    // ASSETS
    images: glob.sync(PATHS.assets.images),
    fonts: glob.sync(PATHS.assets.fonts)
  },
  output: {
    path: path.resolve(__dirname, PATHS.dist),
    filename: "js/[name].js",
    publicPath: "/dist/"
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader
          },
          {
            loader: "css-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
            },
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true,
            },
          }
        ],
      },
      {
        test: /\.(eot|woff|woff2|ttf|svg)(\?\S*)?$/,
        loader: 'file-loader',
        exclude: [
          /images/,
        ],
        options: {
          name: '[name].[ext]',
          outputPath: '/fonts/',
          publicPath: '../fonts/'
        }
      },
      {
        test: /\.(png|jpg|gif|svg|JPG|PNG|ico)$/,
        exclude: [
          /fonts/,
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[folder]/[name].[ext]',
              outputPath: '/images/',
              publicPath: '../images/'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                quality: 50,
              },
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              }
            }
          },
        ],
      },
    ]
  },
  plugins: [
    new WebpackBar({
      name: "ASSETS & CSS Build",
      color: "yellow"
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),
    // new CleanWebpackPlugin({
    //   dry: true,
    // }),
  ],
});

if (devMode) {
  jsBuild.plugins.push(new webpack.HotModuleReplacementPlugin()),
  cssAssetsBuild.plugins.push(new webpack.HotModuleReplacementPlugin())
}

module.exports = [ jsBuild, cssAssetsBuild ];