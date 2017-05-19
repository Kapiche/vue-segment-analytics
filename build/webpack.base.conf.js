const path = require('path');
const projectRoot = path.resolve(__dirname, '../')


module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'vue-segment-analytics.js',
    path: path.join(projectRoot, 'dist')
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      'src': path.resolve(__dirname, '../src')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'eslint-loader',
        enforce: 'pre',
        include: [path.join(projectRoot, 'src')],
        options: {
          formatter: require('eslint-friendly-formatter')
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.join(projectRoot, 'src')]
      }
    ]
  }
}
