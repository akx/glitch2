const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const webpack = require('webpack');

module.exports = {
  entry: './glitcher/index.js',
  output: {
    path: fs.realpathSync('./dist'),
    filename: 'glitcher.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
        ],
      },
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ],
      },
      {
        test: /\.(woff|ttf|eot|otf|svg|woff2|png)$/,
        use: [
          'url-loader',
        ],
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({title: 'glitch2'}),
    new webpack.DefinePlugin({GA_ID: process.env.GA_ID ? JSON.stringify(process.env.GA_ID) : null}),
  ],
};
