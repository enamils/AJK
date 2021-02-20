const path = require("path");
const webpack = require("webpack");
const glob = require("glob");
// const fglob = require("fast-glob");
const WebpackBar = require('webpackbar');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
// const PurgecssPlugin = require("purgecss-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
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
const PATH_SRC = {
  src: path.resolve(__dirname, PATHS.src)
}

const jsBuild = smp.wrap({
  devtool: devMode ? 'eval-cheap-module-source-map' : false,
  entry: {
    // JS
    vendor: PATHS.vendor,
    app: PATHS.javascript
  },
  output: {
    path: path.resolve(__dirname, PATHS.dist),
    filename: "./js/[name].js",
    publicPath: "/dist/"
  },
  devServer: {
    contentBase: path.resolve(__dirname, "./public"),
    historyApiFallback: true,
    port: 8080,
    hot: true,
    compress: true,
    open: true,
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
    // new CleanWebpackPlugin(),
    // new PurgecssPlugin({
    //   paths: glob.sync(`${PATH_SRC.src}/**/*`, { nodir: true }),
    //   // only: ['jquery', 'bootstrap']
    // }),
    // new BundleAnalyzerPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      }
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
    filename: "./js/[name].js",
    publicPath: "/dist/"
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
             options: {
              esModule: false,
            },
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
        loader: 'file-loader',
        options: {
          name: '[folder]/[name].[ext]',
          outputPath: '/images/',
          publicPath: '../images/'
        }
      },
    ]
  },
  plugins: [
    new WebpackBar({
      name: "ASSETS & CSS Build",
      color: "yellow"
    }),
    // new PurgecssPlugin({
    //   paths: glob.sync(`${PATH_SRC.src}/**/*`, { nodir: true }),
    // }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),
    new CleanWebpackPlugin({
      dry: true,
    }),
  ],
});

if (devMode) {
  jsBuild.plugins.push(new webpack.HotModuleReplacementPlugin()),
  cssAssetsBuild.plugins.push(new webpack.HotModuleReplacementPlugin())
}

console.log("devMode ==>", devMode);

module.exports = [ jsBuild, cssAssetsBuild ];