const { decode } = require('html-entities')
const proxy = require('./proxy')
const ogs = require('open-graph-scraper')
const hostname = require('./hostname')

async function getMetadata (url) {
  if (!url) return {}

  const html = await getHTML(url)
  if (!html) {
    throw new Error(`failed to fetch HTML for '${hostname(url)}'`)
  }

  try {
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
      site: result.customMetaTags?.ogSiteName || result.twitterSite || hostname(url)
    }
  } catch (error) {
    throw new Error(`failed to parse metadata for '${hostname(url)}'`)
  }
}

async function getHTML (url) {
  let response
  try {
    response = await fetch(url)
  } catch (error) {
    console.log(`[metadata] failed to get html for '${hostname(url)}'`, error)
    return proxy(url)
  }

  if (response.ok && response.body) {
    return response.text()
  } else {
    console.log(`[metadata] failed to get html for '${hostname(url)}'. Error: ${response.status} '${response.statusText}'`)
    return proxy(url)
  }
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
