import Plugin from '../src/index';
import webpack from 'webpack';
import path from 'path';

const getFullPath = (p: string) => path.resolve(__dirname, p);

const getWebpackConfig = (
  plugin: Plugin
): webpack.Configuration => ({
  entry: getFullPath(`file.js`),
  output: {
    path: getFullPath('assets'),
    publicPath: '/',
    filename: `file.bundle.js`
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
      }
    ]
  },
  resolve: {
    extensions: [".js"]
  },
  plugins: [
    plugin
  ]
});

export default getWebpackConfig;
