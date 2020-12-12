var express = require('express')
var path = require('path')
// var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cookieSession = require('cookie-session')
var cors = require('cors')
var appSettings = require('../appSettings.json')

// routes
var user = require('./routes/user')
var list = require('./routes/list')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Cookies
// app.use(cookieParser())
app.use(cookieSession({
  name: 'readItNowSession',
  secret: appSettings.secretTokenKey
}))

// CORS setup
var corsOptions = {
  origin: ['https://localhost:3000', 'https://localhost:8080'],
  credentials: true
}
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

// Static files
app.use(express.static(path.join(__dirname, 'public')))

// REST API routing
var apiRouter = express.Router()
app.use('/api', apiRouter)
apiRouter.use('/user', user.router)
apiRouter.use('/list', user.auth, list)

// SPA (redirect any non-API requests)
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

module.exports = app
