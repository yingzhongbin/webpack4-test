const path = require('path')
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: require.resolve('./src/globals.js'),
        use: 'exports-loader?file,parse=helpers.parse'
      },
      // {
      //   test: require.resolve('./src/index.js'),
      //   use: 'imports-loader?this=>window'
      // }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new webpack.ProvidePlugin({
      join: ['lodash', 'join']
    }),
    new HtmlWebpackPlugin({
      title: 'Production'
    })
  ]
}