const path = require('path')

module.exports = {
  entry: {
    'index.bundle': path.resolve(__dirname, 'main.mjs')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.js',
    library: '[name]Lib',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },
  mode: 'development'
}
