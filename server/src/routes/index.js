
const user = require('./user')
const list = require('./list')
const { router: favicon } = require('./favicon')
const metadata = require('./metadata')

var express = require('express')
var router = express.Router()

router.use('/user', user.router)
router.use('/list', user.auth, list)
router.use('/favicon', user.auth, favicon)
router.use('/metadata', user.auth, metadata)

module.exports = router
