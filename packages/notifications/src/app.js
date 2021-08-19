const express = require('express')
const logger = require('morgan')
const cookieSession = require('cookie-session')

const indexRouter = require('./routes/index')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// Cookies
if (!process.env.SECRET_SESSION_KEY) {
  throw new Error('SECRET_SESSION_KEY is not defined')
}

app.use(cookieSession({
  name: 'soonerSession',
  secret: process.env.SECRET_SESSION_KEY,
  secure: process.env.NODE_ENV !== 'development'
}))

app.use('/', indexRouter)

module.exports = app
