const express = require('express')
const path = require('path')
const cookieSession = require('cookie-session')
const cors = require('cors')
const helmet = require('helmet')
const routes = require('./routes')
const logger = require('./logger')

const app = express()

app.use(helmet())
app.use(logger())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Cookies
if (!process.env.SECRET_SESSION_KEY) {
  throw new Error('SECRET_SESSION_KEY is not defined')
}

app.use(cookieSession({
  name: 'soonerSession',
  secret: process.env.SECRET_SESSION_KEY,
  maxAge: 432000000 // 5 days in milleseconds
}))

// CORS setup
const corsOptions = {
  origin: ['https://localhost', 'https://localhost:3000', 'https://localhost:8080'],
  credentials: true
}
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

// Static files
app.use(express.static(path.join(__dirname, 'public')))

// REST API routing
app.use(routes)

// SPA (redirect any non-API requests)
app.get('/*', function (req, res) {
  res.status(404).send('Not found')
})

module.exports = app
