const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
module.exports = {
  entry:{
    app:'./src/index.ts',
  },
  devtool:'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  plugins:[
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'output management'
    })
  ],
  output:{
    filename:'[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}