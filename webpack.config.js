const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    index: ['./src/index.js'],
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].js',
    publicPath: '/js',
  },
  devServer: {
    host: '0.0.0.0',
    port: 80,
    allowedHosts: ['geneplanet'],
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: 'all',
          name: 'vendor',
          enforce: true,
        },
      },
    },
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: ['babel-loader?cacheDirectory=true'],
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      STRAVA_REDIRECT_URI: process.env.STRAVA_REDIRECT_URI,
      STRAVA_CLIENT_ID: process.env.STRAVA_CLIENT_ID,
      STRAVA_CLIENT_SECRET: process.env.STRAVA_CLIENT_SECRET,
    }),
    new HtmlWebpackPlugin(),
  ],
  devtool: 'source-map',
};
