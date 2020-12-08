const fs = require('fs')

module.exports = {
  devServer: {
    https: true,
    key: fs.readFileSync('../nginx/conf/nginx.key'),
    cert: fs.readFileSync('../nginx/conf/nginx.cert')
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}
