import SwaggerApiTrackingWebpackPlugin from '../src/index';
import webpack from 'webpack';
import path from 'path';
import {Config} from '../src/config';

const getFullPath = (p: string) => path.resolve(__dirname, p);

const getWebpackConfig = (
  pluginConfig: Config
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
    new SwaggerApiTrackingWebpackPlugin({
      ...pluginConfig,
      intervalSeconds: 5
    })
  ]
});

export default getWebpackConfig;
