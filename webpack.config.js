const path = require("path");
const webpack = require("webpack");
const glob = require("glob");
const fglob = require("fast-glob");
const WebpackBar = require('webpackbar');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const FileManagerPlugin = require('filemanager-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");

// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const devMode = process.env.NODE_ENV !== 'production';
const fs = require("fs");
const yaml = require("js-yaml");

function loadConfig() {
  let ymlFile = fs.readFileSync('config.yml', 'utf8');
  return yaml.load(ymlFile);
}

const {PATHS} = loadConfig();

const jsBuild = {
  devtool: devMode ? 'eval-cheap-module-source-map' : false,
  entry: {
    // JS
    vendor: PATHS.vendor,
    app: PATHS.javascript
  },
  output: {
    path: path.resolve(__dirname, PATHS.public),
    filename: "js/[name].js",
  },
  devServer: {
    static: {
      directory: path.resolve(__dirname, PATHS.public),
      staticOptions: {},
      serveIndex: true,
      watch: true,
    },
    allowedHosts: "all"
  },
  target: 'web',
  plugins: [
    new WebpackBar({
      name: "JS & EJS Build",
      color: "green"
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.ejs'
    }),
    new FileManagerPlugin({
      events: {
        onEnd: {
          copy: [
            { source: "./src/doc/Bulletin_adhesion_AJK.pdf", destination: path.resolve(__dirname, PATHS.public + "/doc/Bulletin_adhesion_AJK.pdf")},
            { source: "./src/mail/contact_me.php", destination: path.resolve(__dirname, PATHS.public + "/mail/contact_me.php")},
          ],
        },
      },
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
        use: [
          {
            loader: 'compile-ejs-loader',
            options: {
              'htmlminOptions': {
                removeComments: true,
                preventAttributesEscaping: true
              }
            }
          }
        ],
      },
    ]
  }
};

const cssAssetsBuild = {
  devtool: devMode ? 'source-map' : false,
  entry: {
    // CSS
    bootstrapVendor: PATHS.stylesheet.bootstrapVendor,
    fontVendor: PATHS.stylesheet.fontVendor,
    app: PATHS.stylesheet.css,

    // ASSETS
    images: fglob.sync(PATHS.assets.images),
    fonts: fglob.sync(PATHS.assets.fonts)
  },
  output: {
    path: path.resolve(__dirname, PATHS.public),
    filename: "js/[name].js",
    //publicPath: '',
    assetModuleFilename: (pathData) => {
      const filepath = path
        .dirname(pathData.filename)
        .split("/")
        .slice(2)
        .join("/");
      return `${filepath}/[name][ext]`;
    },
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
              url: true,
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
        type: 'asset/resource',
        exclude: [
              /images/,
        ],
        generator: {
          filename: 'fonts/[name][ext]'
        }
      },
      {
        test: /\.(png|jpg|gif|svg|JPG|PNG|ico)$/i,
        type: "asset/resource",
        exclude: [
          /fonts/,
        ],
      },
    ]
  },
  optimization: {
    minimizer: [
      "...",
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            // Lossless optimization with custom option
            // Feel free to experiment with options for better result for you
            plugins: [
              ["gifsicle", { interlaced: true }],
              ["jpegtran", { progressive: true }],
              ["optipng", { optimizationLevel: 5 }],
              // Svgo configuration here https://github.com/svg/svgo#configuration
              [
                "svgo",
                {
                  plugins: [
                    {
                      name: "preset-default",
                      params: {
                        overrides: {
                          removeViewBox: false,
                          addAttributesToSVGElement: {
                            params: {
                              attributes: [
                                { xmlns: "http://www.w3.org/2000/svg" },
                              ],
                            },
                          },
                        },
                      },
                    },
                  ],
                },
              ],
            ],
          },
        },
      }),
    ],
  },
  plugins: [
    new WebpackBar({
      name: "ASSETS & CSS Build",
      color: "blue"
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].css',
      chunkFilename: 'css/[id].css',
    }),
  ],
};

module.exports = [ jsBuild, cssAssetsBuild ];