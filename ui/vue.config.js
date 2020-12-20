const fs = require('fs')

let devOptions = {}
if (process.env.NODE_ENV === 'development') {
  devOptions = {
    devServer: {
      https: true,
      key: fs.readFileSync('../nginx/conf/nginx.key'),
      cert: fs.readFileSync('../nginx/conf/nginx.cert')
    },
    configureWebpack: {
      devtool: 'source-map'
    }
  }
}
module.exports = {
  ...devOptions
}
