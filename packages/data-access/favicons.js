const geoffrey = require('./geoffrey')

module.exports.getFaviconsFromCache = (domain) => {
  geoffrey.getFavicons().findOne({ domain })
}

module.exports.setFaviconsInCache = (domain, favicons) => {
  geoffrey.getFavicons().updateOne({ domain }, { '$set': {domain, favicons} }, { upsert: true })
}
