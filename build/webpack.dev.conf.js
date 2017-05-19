var baseWebpackConfig = require('./webpack.base.conf')
var FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
var merge = require('webpack-merge')
var webpack = require('webpack')

module.exports = merge(baseWebpackConfig, {
  devtool: '#cheap-module-eval-source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"developement"'
      }
    }),
    // https://github.com/glenjamin/webpack-hot-middleware#installation--usage
    new webpack.HotModuleReplacementPlugin(),
    new FriendlyErrorsPlugin()
  ]
})
