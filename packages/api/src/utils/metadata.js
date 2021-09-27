const urlMetadata = require('url-metadata')

async function getMetadata (url) {
  if (!url) return {}

  try {
    var metadata = await urlMetadata(url)
  } catch (error) {
    console.error(`failed to getMetadata for link: ${url} error: '${error}''`)
    throw error
  }

  return {
    title: metadata.title || "Sorry, title wasn't found",
    site: metadata['og:site_name'] || getHostname(url)
  }
}

function getHostname (link) {
  if (!link) return null

  let url
  try {
    url = new URL(link)
  } catch {
    return null
  }

  return url.hostname
}

function parseLink (text) {
  // eslint-disable-next-line no-useless-escape
  const urlRegEx = /(\b(https?):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig
  const results = urlRegEx.exec(text)
  if (results) {
    return results[0]
  } else {
    return null
  }
}

module.exports = {
  getMetadata,
  parseLink
}
