const { InjectManifest } = require('workbox-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')

let config

if (process.env.NODE_ENV === 'production') {
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
} else {
  config = {
    devServer: {
      proxy: {
        '^/api': {
          target: 'http://localhost:3000',
          pathRewrite: { '^/api': '' },
          ws: true,
          changeOrigin: true
        }
      }
    },
    configureWebpack: {
      devtool: 'source-map'
    }
  }
}

module.exports = config
