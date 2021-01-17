const urlMetadata = require('url-metadata')

async function getMetadata (link) {
  if (!link) { return null }

  return urlMetadata(link)
}

async function getTitleAndSite (link) {
  let metadata
  try {
    metadata = await getMetadata(link)
  } catch (error) {
    console.error(`metadata: failed to getMetadata for link: ${link} error: ${error.Error}`)
    return { title: null, site: null }
  }

  const title = metadata.title || 'Sorry, title wasn\'t found'
  const site = metadata['og:site_name'] || getHostname(link)

  return {
    title,
    site
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
  getTitleAndSite,
  parseLink
}
