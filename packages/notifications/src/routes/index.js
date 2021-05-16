const express = require('express')
const subscription = require('./subscription')
const router = express.Router()

router.use('/subscription', subscription)

module.exports = router
