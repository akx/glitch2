const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');

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
    ],
  },
  plugins: [
    new HtmlWebpackPlugin(),
  ],
};
