
const user = require('./user')
const list = require('./list')
const favicon = require('./favicon')

var express = require('express')
var router = express.Router()

router.use('/user', user.router)
router.use('/list', user.auth, list)
router.use('/favicon', user.auth, favicon)

module.exports = router
