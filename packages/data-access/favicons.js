const geoffrey = require('./geoffrey')

module.exports.getFaviconsFromCache = async (domain) => {
  if (!domain) return []

  const result = await geoffrey.getFavicons().findOne({ domain })
  return result ? result.favicons : []
}

module.exports.setFaviconsInCache = (domain, favicons) => {
  if (!domain || !favicons) return

  return geoffrey.getFavicons().updateOne({ domain }, { '$set': {domain, favicons} }, { upsert: true })
}
