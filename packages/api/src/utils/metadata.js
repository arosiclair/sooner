const { decode } = require('html-entities')
const proxy = require('./proxy')
const ogs = require('open-graph-scraper')

async function getMetadata (url) {
  if (!url) return {}

  const html = await getHTML(url)
  const { result } = await ogs({
    html,
    customMetaTags: [
      {
        multiple: false,
        property: 'site_name',
        fieldName: 'ogSiteName'
      }
    ]
  })

  return {
    title: decode(result.ogTitle) || "Sorry, title wasn't found",
    site: result.customMetaTags.ogSiteName || getHostname(url)
  }
}

async function getHTML (url) {
  let response
  try {
    response = await fetch(url)
  } catch (error) {
    console.log(`coudln't fetch url: '${url}'`)
    return proxy(url)
  }

  if (response.ok && response.body) {
    return response.text()
  } else {
    console.log(`failed to get metadata for ${url}. Error: ${response.status} '${response.statusText}'`)
    return proxy(url)
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
