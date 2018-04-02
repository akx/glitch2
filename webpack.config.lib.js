const path = require('path');

module.exports = {
  entry: './libglitch/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'libglitch.js',
    library: 'Glitch',
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
    ],
  },
};
