const { InjectManifest } = require('workbox-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

let config = {}

if (process.env.NODE_ENV === 'production' || process.env.VUE_APP_DEV_SERVICE_WORKER) {
  config = {
    configureWebpack: {
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
}

if (process.env.NODE_ENV === 'development') {
  config = {
    ...config,
    devServer: {
      disableHostCheck: true,
      proxy: {
        '^/api': {
          target: 'http://localhost:3000',
          pathRewrite: { '^/api': '' },
          ws: true,
          changeOrigin: true
        },
        '^/push': {
          target: 'http://localhost:3001',
          pathRewrite: { '^/push': '' },
          ws: true,
          changeOrigin: true
        }
      }
    },
    configureWebpack: {
      ...config.configureWebpack,
      devtool: 'source-map'
    }
  }
}

module.exports = config
