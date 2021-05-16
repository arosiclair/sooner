
const user = require('./user')
const list = require('./list')
const { router: favicon } = require('./favicon')
const metadata = require('./metadata')
const auth = require('@sooner/middleware/auth')

var express = require('express')
var router = express.Router()

router.use('/user', user)
router.use('/list', auth, list)
router.use('/favicon', auth, favicon)
router.use('/metadata', auth, metadata)

module.exports = router
