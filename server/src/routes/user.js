/* eslint-disable no-useless-escape */
var express = require('express')
var router = express.Router()

const { sanitizeAndValidate, jsonValidation } = require('../utils/validation')
const { ErrorResponse } = require('../utils/errors')
const { addUser, getUserById, updateUser, getUserbyEmailAndPass, updatePassword } = require('../daos/users')
const { createSession, deleteSession, getSession, invalidateSessions } = require('../daos/sessions')
const { createResetRequest, getResetRequestByToken, deleteResetRequest } = require('../daos/resetRequests')

/*
  Endpoint for creating a user.
  Responds with a session token in payload and set's the token in a session cookie
*/
const emailRegEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
const registerUserSchema = {
  name: (val) => typeof val === 'string' && val.length <= 30,
  email: (val) => {
    return typeof val === 'string' && emailRegEx.test(val.toLowerCase())
  },
  password: (val) => isValidPassword(val)
}
router.post('/register', jsonValidation(registerUserSchema), async (req, res) => {
  const userId = await addUser(req.body.name, req.body.email, req.body.password, { linkTTL: 5 })

  if (userId) {
    req.session.token = await createSession(userId)
    res.json({
      result: 'success',
      name: req.body.name,
      token: req.session.token
    })
  } else {
    res.status(500).json(new ErrorResponse('db error'))
  }
})

/*
  Endpoint for logging in
  Responds with a session token in payload and set's the token in a session cookie
  Expects json payload with following params:
*/
const loginSchema = {
  email: (val) => typeof val === 'string',
  password: (val) => typeof val === 'string'
}
router.post('/login', jsonValidation(loginSchema), async function (req, res) {
  const user = await getUserbyEmailAndPass(req.body.email, req.body.password)
  if (!user) {
    res.status(401).json(new ErrorResponse('Email/password is incorrect'))
  } else {
    req.session.token = await createSession(user._id)
    req.sessionOptions.maxAge = 432000 * 1000 // 5 days in millesconds
    res.json({
      result: 'success',
      name: user.name,
      token: req.session.token
    })
  }
})

/*
  Endpoint for logging out
  Responds with 'success' or 'error'
  Expects session token in json payload or in session cookie
*/
router.post('/logout', async (req, res) => {
  var token = req.body.token ? req.body.token : req.session.token

  if (token) {
    await deleteSession(token)
    req.session.token = ''
    res.json({ result: 'success' })
  } else {
    res.status(400).json(new ErrorResponse('No token provided'))
  }
})

router.all('/data', authMiddleware)
router.get('/data', async function (req, res) {
  var user = await getUserById(req.userId)
  if (user) {
    res.json({
      result: 'success',
      name: user.name,
      email: user.email,
      prefs: user.prefs
    })
  } else {
    res.status(500).json(new ErrorResponse("the user wasn't found"))
  }
})

const userDataSchema = {
  name: value => typeof value === 'string' && value.length <= 30,
  // email: value => typeof value === 'string' && validateEmail(value),
  prefs: value => typeof value === 'object' && !sanitizeAndValidate(value, userPrefsSchema).length
}
const userPrefsSchema = {
  linkTTL: value => typeof value === 'number',
  linkOrder: value => typeof value === 'string' && ['asc', 'desc'].includes(value)
}

router.patch('/data', jsonValidation(userDataSchema, true, false), async function (req, res) {
  const updatedUser = await updateUser(req.userId, req.body)
  if (updateUser) {
    res.json({
      result: 'success',
      data: {
        name: updatedUser.name,
        email: updatedUser.email,
        prefs: updatedUser.prefs
      }
    })
  } else {
    res.status(500).json(ErrorResponse('db error'))
  }
})

const resetPasswordSchema = {
  email: (val) => typeof val === 'string'
}
router.post('/resetPassword', jsonValidation(resetPasswordSchema), async (req, res) => {
  const token = await createResetRequest(req.body.email)
  if (!token) {
    return res.status(400).json(new ErrorResponse('cannot create a reset request for this user'))
  }

  if (sendResetEmail(req.body.email, token)) {
    return res.json({
      result: 'success'
    })
  } else {
    return res.status(400).json(new ErrorResponse('cannot create a reset request for this user'))
  }
})

const updatePasswordSchema = {
  token: (val) => typeof val === 'string',
  password: (val) => isValidPassword(val)
}
router.post('/updatePassword', jsonValidation(updatePasswordSchema), async (req, res) => {
  const resetRequest = await getResetRequestByToken(req.body.token)
  if (!resetRequest) {
    return res.status(400).json(new ErrorResponse('bad token'))
  }

  const success = await updatePassword(resetRequest.userId, req.body.password)
  if (success) {
    invalidateSessions(resetRequest.userId)
    deleteResetRequest(resetRequest.token)
    res.json({ result: 'success' })
  } else {
    res.status(500).status(new ErrorResponse('password update failed'))
  }
})

// helpers

function isValidPassword (password) {
  return typeof password === 'string' &&
    password.length >= 8 &&
    password.length <= 32 &&
    /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])/.test(password)
}

function sendResetEmail (email, token) {
  // TODO: implement this after paying for mail service
  return true
}

/*
  Authentication middleware to be used with user endpoints
  expects either the session token to be present in the json payload
  or the request's session to have the token
*/
module.exports.auth = authMiddleware

async function authMiddleware (req, res, next) {
  var error = await authImpl(req)
  if (error) {
    res.status(401).json(new ErrorResponse(error))
  } else {
    next()
  }
}

async function authImpl (req) {
  var token = req.body.token ? req.body.token : req.session.token

  if (token) {
    const session = await getSession(token)
    if (session) {
      // attach the user's mongo ID for easy access
      req.userId = session.userId
      req.sessionToken = session.token
    } else {
      return 'invalid session'
    }
  } else {
    return 'invalid session'
  }
}

module.exports.router = router
