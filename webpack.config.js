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
    watchContentBase: true,
    hot: true,
    inline: true,
    overlay: true
  },
  plugins: [
    new WebpackBar({
      name: "JS Build"
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
    }),
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
  plugins: [
    new WebpackBar({
      name: "ASSETS & CSS Build",
      color: "yellow"
    }),
    // new PurgecssPlugin({
    //   paths: glob.sync(`${PATH_SRC.src}/**/*`, { nodir: true }),
    // }),
    new MiniCssExtractPlugin({
      filename: devMode ? 'css/[name].css' : 'css/[name].[hash:8].css',
      chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[hash:8].css',
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: [
          'style-loader',
          {
            loader: MiniCssExtractPlugin.loader
            // options: {
            //   hmr: devMode,
            //   reloadAll: true
            // }
          },
          'css-loader',
          'postcss-loader',
          'sass-loader',
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
});

// if (devMode) {
//   jsBuild.devtool = 'cheap-module-eval-source-map';
// }

module.exports = [ jsBuild, cssAssetsBuild ];