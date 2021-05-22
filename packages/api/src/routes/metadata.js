const express = require('express')
const { query } = require('express-validator')
const { ErrorResponse } = require('@sooner/responses/errors')
const { getMetadata } = require('../utils/metadata')
const { isEmptyObject } = require('../utils/misc')
const validation = require('@sooner/middleware/validation')
const router = express.Router()

const metadataValidation = [
  query('url').isURL({ require_valid_protocol: true, protocols: ['http', 'https'] }),
  validation
]
router.get('/', ...metadataValidation, async (req, res) => {
  const metadata = await getMetadata(req.query.url)

  if (isEmptyObject(metadata)) {
    res.status(406).json(new ErrorResponse('metadata not found'))
  } else {
    res.json(metadata)
  }
})

module.exports = router
