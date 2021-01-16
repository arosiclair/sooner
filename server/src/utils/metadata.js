const urlMetadata = require('url-metadata')

async function getMetadata (link) {
  if (!link) { return null }

  return urlMetadata(link)
}

async function getTitleAndSite (link) {
  let metadata
  try {
    metadata = await getMetadata(link)
  } catch {
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

module.exports = {
  getMetadata,
  getTitleAndSite
}
