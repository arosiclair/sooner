const hostname = require('./hostname')

module.exports = async (url) => {
  console.log(`[proxy] proxying for '${hostname(url)}'...`)
}
