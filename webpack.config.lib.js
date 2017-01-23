module.exports = {
  entry: './libglitch/index.js',
  output: {
    path: './dist',
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
