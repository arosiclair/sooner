const express = require('express')
const subscription = require('./subscription')
const router = express.Router()
const auth = require('@sooner/middleware/auth')

router.use('/subscription', auth, subscription)

module.exports = router
