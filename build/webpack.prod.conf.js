var baseWebpackConfig = require('./webpack.base.conf')
var merge = require('webpack-merge')
var webpack = require('webpack')

module.exports = merge(baseWebpackConfig, {
  devtool: '#source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      },
      sourceMap: true
    })
  ]
})

