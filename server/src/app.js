var express = require('express')
var path = require('path')
// var cookieParser = require('cookie-parser')
var logger = require('morgan')
var cookieSession = require('cookie-session')
var cors = require('cors')

// routes
var user = require('./routes/user')
var list = require('./routes/list')

var app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Cookies
if (!process.env.SECRET_SESSION_KEY) {
  throw new Error('SECRET_SESSION_KEY is not defined')
}

app.use(cookieSession({
  name: 'soonerSession',
  secret: process.env.SECRET_SESSION_KEY
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
app.use('/user', user.router)
app.use('/list', user.auth, list)

// SPA (redirect any non-API requests)
app.get('/*', function (req, res) {
  res.status(404).send('Not found')
})

module.exports = app
