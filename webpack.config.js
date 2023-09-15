
// mode: 'development',
// devtool: 'inline-source-map',
module.exports = {
  renderer: {
    mode: 'production',
    devtool: 'source-map',
    entry: './src/renderer/javascripts/index.js',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react'
              ]
            }
          }
        },
      ]
    }
  },
  preload: {
    entry: './src/preload/index.js'
  },
  main: {
    entry: './src/main/index.js',
    module: {
      rules: [
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
              }
            }
          ],
        }
      ]
    }
  }
}

