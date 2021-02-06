const express = require('express')
const router = express.Router()

const urlMetadata = require('url-metadata')
const { getListIdForUser, getListById, updateLinks, addLink, deleteLink } = require('../daos/lists')
const { getUserPrefs } = require('../daos/users')
const { ErrorResponse, InvalidJSONResponse } = require('../utils/errors')
const { jsonValidation } = require('../utils/validation')
const multer = require('multer')
const { getTitleAndSite, parseLink } = require('../utils/metadata')
const upload = multer()

router.get('/', async function (req, res) {
  const listId = await getListIdForUser(req.userId)
  const list = await getListById(listId)

  if (list) {
    // clean the list of expired links
    const links = list.links
    const { linkTTL } = await getUserPrefs(req.userId)

    const unexpiredLinks = cleanExpiredLinks(links, linkTTL)
    if (unexpiredLinks !== links) {
      updateLinks(listId, unexpiredLinks)
    }

    res.json({
      result: 'success',
      list: unexpiredLinks,
      numExpired: links.length - unexpiredLinks.length
    })
  } else {
    res.status(500).json(new ErrorResponse('no list data found'))
  }
})

/*
  Endpoint for adding a link to a user's list
  Creates a document in the list collection for the user if they do not already have one
*/
const addLinkSchema = {
  linkName: (val) => val === undefined || (typeof val === 'string' && val.length <= 140),
  siteName: (val) => val === undefined || (typeof val === 'string' && val.length <= 140),
  link: (val) => typeof val === 'string',
  addedOn: (val) => val === undefined || (typeof val === 'string' && new Date(val).toString().toLowerCase() !== 'invalid date')
}
router.post('/', jsonValidation(addLinkSchema), async function (req, res) {
  const link = req.body.link
  let linkName = req.body.linkName
  let siteName = req.body.siteName

  if (!linkName || !siteName) {
    try {
      const { title, site } = await getTitleAndSite(link)
      linkName = title
      siteName = site
    } catch (error) {
      return res.status(400).json(new InvalidJSONResponse(['link']))
    }
  }

  const newLinkId = await addLink(req.userId, linkName, siteName, link, req.body.addedOn)
  res.json({
    result: 'success',
    linkId: newLinkId
  })
})

const shareLinkSchema = {
  title: (val) => val === undefined || (typeof val === 'string' && val.length <= 140),
  url: (val) => val === undefined || typeof val === 'string',
  text: (val) => val === undefined || typeof val === 'string'
}
router.post('/share', upload.none(), jsonValidation(shareLinkSchema), async function (req, res) {
  try {
    const link = req.body.url || parseLink(req.body.text)
    const { title, site } = await getTitleAndSite(link)

    if (!link) {
      throw new Error('No link provided')
    } else if (!title || !site) {
      throw new Error("Couldn't find metadata")
    } else {
      const newLinkId = await addLink(req.userId, title, site, link)
      if (!newLinkId) {
        throw new Error('Add link DB error')
      }

      res.redirect('/list?share=true&success=true')
    }
  } catch {
    res.redirect('/list?share=true&failed=true')
  }
})

router.delete('/:linkId', async function (req, res) {
  const linkId = req.params.linkId
  await deleteLink(req.userId, linkId)
  res.json({
    result: 'success'
  })
})

router.get('/linkMetadata', async function (req, res) {
  if (!req.query.url) {
    res.status(400).json(new ErrorResponse('bad link'))
    return
  }

  try {
    var metadata = await urlMetadata(req.query.url)
    res.json({
      result: 'success',
      metadata: metadata
    })
  } catch (error) {
    res.status(406).json(new ErrorResponse('metadata not found'))
  }
})

module.exports = router

function cleanExpiredLinks (links, linkTTL) {
  var unexpiredLinks = []
  var changed = false

  for (var i = 0; i < links.length; i++) {
    var link = links[i]

    if (!link.addedOn) {
      changed = true
      continue
    }

    var expireTime = new Date(link.addedOn.valueOf())
    expireTime.setDate(expireTime.getDate() + linkTTL)
    if (new Date() > expireTime) {
      changed = true
      continue
    }

    unexpiredLinks.push(link)
  }

  return changed ? unexpiredLinks : links
}
