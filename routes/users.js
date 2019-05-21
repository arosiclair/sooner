/* eslint-disable no-useless-escape */
var express = require('express')
var router = express.Router()

var geoffrey = require('../geoffrey')
var passwordHasher = require('password-hash')
var uuidv4 = require('uuid/v4')

/* GET users listing. */
router.post('/register', function (req, res) {
  var result = validateEmailAndPass(req)
  if (result) {
    res.json(result)
    return
  }

  var newUser = {
    email: req.body.email,
    password: passwordHasher.generate(req.body.password, { algorithm: 'SHA256' })
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

// requires 8 chars, lowercase, uppercase, and number
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

module.exports.auth = function (req, res, next) {
  var token = req.body.token ? req.body.token : req.session.token

  if (token) {
    geoffrey.getSessions().findOne({ token: token })
      .then(matchedSession => {
        if (!matchedSession) {
          console.log('Invalid session token given: ' + token)

          res.json({
            result: 'error',
            reason: 'invalid session'
          })
        } else {
          // attach the user's mongo ID for easy access
          req.objectId = matchedSession.userId

          res.json({
            result: 'success',
            objId: matchedSession.userId
          })
        }
      })
  } else {
    console.log('No session token given: ' + token)

    res.json({
      result: 'error',
      reason: 'invalid session'
    })
  }
}

module.exports.router = router
