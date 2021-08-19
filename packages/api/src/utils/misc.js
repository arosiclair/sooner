const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const isEmptyObject = (obj) => obj && Object.keys(obj).length === 0

const getHostname = (url) => url ? new URL(url).hostname : ''

module.exports = {
  delay,
  isEmptyObject,
  getHostname
}
