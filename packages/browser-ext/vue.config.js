module.exports = {
  pages: {
    popup: {
      template: 'public/browser-extension.html',
      entry: './src/popup/main.js',
      title: 'Popup'
    }
  },
  pluginOptions: {
    browserExtension: {
      componentOptions: {
        background: {
          entry: 'src/service-worker.js'
        }
      }
    }
  },
  configureWebpack: {
    devtool: 'source-map'
  }
}
