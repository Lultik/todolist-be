const ESLintPlugin = require('eslint-webpack-plugin');
const path = require('path');

const esLintPlugin = (isDev) => isDev ? [] : [ new ESLintPlugin({ extensions: ['ts', 'js'] }) ];

module.exports = ({develop}) =>  ({
  mode: develop ? 'development' : "production",
  devtool: develop ? 'inline-source-map' : false,
  entry: {
    index: './index.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.[tj]s$/i,
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
});
