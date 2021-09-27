const express = require('express')
const { query } = require('express-validator')
const { ErrorResponse } = require('@sooner/responses/errors')
const { getMetadata } = require('../utils/metadata')
const validation = require('@sooner/middleware/validation')
const router = express.Router()

const metadataValidation = [
  query('url').isURL({ require_valid_protocol: true, protocols: ['http', 'https'] }),
  validation
]
router.get('/', ...metadataValidation, async (req, res) => {
  try {
    var metadata = await getMetadata(req.query.url)
  } catch (error) {
    return res.status(406).json(new ErrorResponse('metadata not found'))
  }

  res.json(metadata)
})

module.exports = router
