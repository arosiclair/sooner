const path = require('path')
const { InjectManifest } = require('workbox-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

const config = {
  configureWebpack: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src/')
      }
    },
    plugins: [
      new CopyPlugin({
        patterns: [
          { from: 'public/', to: './' }
        ]
      }),
      new InjectManifest({
        swSrc: './src/service-worker.js'
      })
    ]
  }
}

if (process.env.NODE_ENV === 'development') {
  config.devServer = {
    https: true,
    disableHostCheck: true,
    proxy: {
      '^/api': {
        target: 'http://localhost:3000',
        pathRewrite: { '^/api': '' },
        ws: true,
        changeOrigin: true
      }
    }
  }

  config.configureWebpack.devtool = 'source-map'
}

module.exports = config
