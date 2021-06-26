const path = require('path');

module.exports = {
  entry: './libglitch/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'libglitch.js',
    library: 'Glitch',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.[jt]sx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};
