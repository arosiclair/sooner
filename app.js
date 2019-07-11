var createError = require('http-errors')
var express = require('express')
var path = require('path')
var logger = require('morgan')

var cookieSession = require('cookie-session')

var appSettings = require('./appSettings.json')

var users = require('./routes/users')
var lists = require('./routes/lists')

var app = express()

// view engine setup
// app.set('views', path.join(__dirname, 'views'))

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieSession({
  name: 'readItNowSession',
  secret: appSettings.secretTokenKey
}))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/users', users.router)
app.use('/list', users.auth, lists)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  // res.locals.message = err.message
  // res.locals.error = req.app.get('env') === 'development' ? err : {}

  if (err) {
    res.status(err.status)
  } else {
    res.status(404)
  }

  res.send('Error')
})

module.exports = app
