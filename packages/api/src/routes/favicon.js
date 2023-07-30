const express = require('express')
const router = express.Router()
const axios = require('axios')
const cheerio = require('cheerio')
const { param, query } = require('express-validator')
const validation = require('@sooner/middleware/validation')
const { getFaviconsFromCache, setFaviconsInCache, getFaviconOverride } = require('../../../data-access/favicons')

const faviconValidation = [
  param('domain').isString(),
  query('sizes').optional().matches(/\d+(,\d+)*/),
  validation
]
router.get('/:domain', ...faviconValidation, async (req, res) => {
  const domainName = req.params.domain
  const targetSizes = req.query.sizes?.split(',').map(Number).filter(Boolean) || []
  res.json(await getFavicons(domainName, targetSizes))
})

async function getFavicons (domainName, targetSizes) {
  const override = getFaviconOverride(domainName)
  if (override) {
    return override
  }

  const url = `https://${domainName}`
  const html = await getHtml(url)

  if (!html) {
    return getFaviconsFromCache(domainName)
  } else {
    const linkedIcons = getLinkedIcons(html, url)
    setFaviconsInCache(domainName, linkedIcons)
    return targetSizes.length ? getTargetIcons(linkedIcons, targetSizes) : linkedIcons
  }
}

/** Get HTML from url as string */
async function getHtml (url) {
  try {
    var resp = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36'
      }
    })
  } catch (error) {
    console.error(error)
    return null
  }

  return typeof resp.data === 'string' ? resp.data : null
}

function getLinkedIcons (html, url) {
  if (!html) return []

  const $ = cheerio.load(html)
  const selectors = [
    "link[rel='icon']",
    "link[rel='shortcut icon']",
    "link[rel='apple-touch-icon']",
    "link[rel='apple-touch-icon-precomposed']",
    "link[rel='apple-touch-startup-image']",
    "link[rel='mask-icon']",
    "link[rel='fluid-icon']"
  ]
  const icons = []

  selectors.forEach(selector => {
    $(selector).each((index, element) => {
      const { href, sizes, type } = element.attribs
      if (href && href !== '#') {
        let iconUrl = href
        if (href.startsWith('/') || !href.startsWith('http')) {
          iconUrl = new URL(href, url).href
        }

        const icon = {
          width: parseWidth(sizes),
          sizes,
          src: iconUrl,
          type
        }
        icons.push(icon)
      }
    })
  })

  return icons
}

function parseWidth (sizes) {
  if (/\d+[x×]\d+/i.test(sizes)) {
    return Number(/\d+/.exec(sizes)[0])
  } else {
    return undefined
  }
}

function getTargetIcons (icons, targetSizes) {
  if (!targetSizes || !targetSizes.length) return icons

  const targetIcons = {}
  targetSizes.forEach(targetSize => {
    const closestIcon = getClosestIcon(icons, targetSize)
    if (closestIcon) targetIcons[targetSize] = closestIcon
  })

  const fallback = icons.find(icon => !icon.width)
  targetIcons.fallback = fallback

  return targetIcons
}

function getClosestIcon (icons, targetSize) {
  if (!icons || !icons.length) return null

  let closestIcon = null
  let closestDiff = Number.MAX_VALUE

  icons.forEach(icon => {
    if (!icon.width) return

    const diff = Math.abs(targetSize - icon.width)

    if (!closestIcon || closestDiff > diff) {
      closestIcon = icon
      closestDiff = diff
    }
  })

  return closestIcon
}

module.exports = {
  router,
  getFavicons
}
