var createError = require('http-errors')
var express = require('express')
var path = require('path')
var logger = require('morgan')

var cookieSession = require('cookie-session')
var cors = require('cors')

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

var corsOptions = {
  origin: ['https://localhost:3000', 'https://localhost:8080'],
  credentials: true
}

app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.use(express.static(path.join(__dirname, 'public')))

// REST API routing
var apiRouter = express.Router()
app.use('/api', apiRouter)
apiRouter.use('/users', users.router)
apiRouter.use('/list', users.auth, lists)

// redirect any non-api calls to the SPA
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

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
