const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const isEmptyObject = (obj) => obj && Object.keys(obj).length === 0

module.exports = {
  delay,
  isEmptyObject
}
