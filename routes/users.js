/* eslint-disable no-useless-escape */
var express = require('express')
var router = express.Router()

var geoffrey = require('../geoffrey')
var passwordHasher = require('password-hash')
var uuidv4 = require('uuid/v4')

/*
  Endpoint for creating a user.
  Responds with a session token in payload and set's the token in a session cookie
  Expects json payload with following params:
  name: string
  email: string
  password: string
*/
router.post('/register', function (req, res) {
  var result = validateEmailAndPass(req)
  if (!req.body.name || req.body.name.length > 30) {
    result = {
      result: 'error',
      reason: 'bad name'
    }
  }

  if (result) {
    res.json(result)
    return
  }

  var newUser = {
    name: req.body.name,
    email: req.body.email,
    password: passwordHasher.generate(req.body.password, { algorithm: 'SHA256' }),
    prefs: {
      linkTTL: 5 // days until link expires
    }
  }

  geoffrey.getUsers().insertOne(newUser,
    function onInsertUserResult (error, result) {
      if (error || result.insertedCount !== 1) {
        res.json({
          result: 'error',
          reason: 'db insert failed'
        })
      } else {
        req.session.token = createSession(result.insertedId)

        res.json({
          result: 'success',
          token: req.session.token
        })
      }
    })
})

/*
  Endpoint for logging in
  Responds with a session token in payload and set's the token in a session cookie
  Expects json payload with following params:
  email: string
  password: string
*/
router.post('/login', function (req, res) {
  var result = validateEmailAndPass(req)
  if (result) {
    res.json(result)
    return
  }

  geoffrey.getUsers().findOne({ email: req.body.email })
    .then(matchedUser => {
      if (!matchedUser) {
        res.json({
          result: 'error',
          reason: 'couldn\'t find user'
        })
        return
      }

      if (passwordHasher.verify(req.body.password, matchedUser.password)) {
        req.session.token = createSession(matchedUser._id)
        res.json({
          result: 'success',
          token: req.session.token
        })
      } else {
        res.json({
          result: 'failed',
          reason: 'incorrect password'
        })
      }
    })
})

function validateEmailAndPass (req) {
  var errorReason
  if (!validateEmail(req.body.email)) {
    errorReason = 'bad email'
  } else if (!validatePass(req.body.password)) {
    errorReason = 'bad password'
  }

  if (errorReason) {
    return {
      result: 'error',
      reason: errorReason
    }
  } else {
    return null
  }
}

function validateEmail (email) {
  if (!email || typeof (email) !== 'string') {
    return false
  }

  // taken from https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email.toLowerCase())
}

// Password must be a string with lowercase, uppercase, and numeral characters
// TODO: this does not accept special characters
function validatePass (password) {
  if (!password || typeof (password) !== 'string') {
    return false
  }

  if (password.length < 8 || password.length > 32) {
    return false
  }

  // taken from https://stackoverflow.com/questions/19605150/regex-for-password-must-contain-at-least-eight-characters-at-least-one-number-a
  var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
  return re.test(password)
}

// Creates a new session for the user and adds it to the sessions collection
// the session document will be removed after an hour based on createdAt
function createSession (userId) {
  var newToken = uuidv4() // TODO
  var newSession = {
    createdAt: new Date(),
    userId: userId,
    token: newToken
  }

  geoffrey.getSessions().insertOne(newSession)

  return newToken
}

// Endpoint for verifying valid login
router.get('/auth', async function (req, res) {
  var error = await auth(req)
  if (error) {
    res.json(error)
  } else {
    res.json({
      result: 'success'
    })
  }
})

module.exports.auth = async function (req, res, next) {
  var error = await auth(req)
  if (error) {
    res.json(error)
  } else {
    next()
  }
}

/*
  Authentication middleware to be used with user endpoints
  expects either the session token to be present in the json payload
  or the request's session to have the token
*/
async function auth (req) {
  var token = req.body.token ? req.body.token : req.session.token
  var error

  if (token) {
    var matchedSession = await geoffrey.getSessions().findOne({ token: token })
    if (!matchedSession) {
      console.log('Invalid session token given: ' + token)
      error = {
        result: 'error',
        reason: 'invalid session'
      }
    } else {
      // attach the user's mongo ID for easy access
      req.userId = matchedSession.userId
    }
  } else {
    console.log('No session token given: ' + token)

    error = {
      result: 'error',
      reason: 'invalid session'
    }
  }

  return error
}

module.exports.getUserPrefs = async function (userId) {
  if (!userId) {
    return null
  }

  var userDoc = await geoffrey.getUsers().findOne({ '_id': userId })
  if (userDoc.prefs) {
    return userDoc.prefs
  } else {
    var newPrefs = {
      linkTTL: 5
    }

    geoffrey.getUsers().updateOne({ '_id': userId }, { '$set': { 'prefs': newPrefs } })
    return newPrefs
  }
}

module.exports.router = router
