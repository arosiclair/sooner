let devOptions = {}
if (process.env.NODE_ENV === 'development') {
  devOptions = {
    devServer: {
      https: true,
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
module.exports = {
  ...devOptions
}
