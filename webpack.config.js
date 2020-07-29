
var path = require('path');
var node
module.exports = {
  entry: path.resolve(__dirname, './index.js'),
  output: {
    path: path.resolve(__dirname, './build/lib'),
    filename: 'index.js',
    library: '',
    libraryTarget: 'umd'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/react'],
          plugins: [
            "@babel/plugin-proposal-class-properties",
            '@babel/plugin-transform-react-jsx'
          ]
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  externals: {
    'react': 'react', // Case matters here 
    'react-dom' : 'reactDOM' // Case matters here 
  }
};