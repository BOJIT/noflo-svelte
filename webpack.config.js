const path = require('path');

module.exports = {
  entry: {
    'the-graph': './index.js',
  },
  output: {
    path: path.resolve(__dirname, './dist/'),
    filename: '[name].js',
    sourceMapFilename: '[name].js.map',
  },
  mode: 'production',
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.styl$/,
        use: ['style-loader', 'css-loader', 'stylus-loader'],
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[ext]',
              outputPath: 'fonts/',
            },
          },
        ],
      },
    ],
  },
  resolve: {
    fallback: {
      events: require.resolve('events/'),
      fs: false,
    },
  },
};
