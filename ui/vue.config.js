const path = require('path')

const config = {
  configureWebpack: {
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src/')
      }
    }
  }
}

if (process.env.NODE_ENV === 'development') {
  config.devServer = {
    https: true,
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
