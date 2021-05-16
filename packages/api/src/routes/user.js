/* eslint-disable no-useless-escape */
var express = require('express')
var router = express.Router()

const { validation } = require('../utils/validation')
const { ErrorResponse } = require('../utils/errors')
const { addUser, getUserById, updateUser, getUserbyEmailAndPass, updatePassword } = require('../daos/users')
const { createSession, deleteSession, invalidateSessions } = require('../daos/sessions')
const { createResetRequest, getResetRequestByToken, deleteResetRequest } = require('../daos/reset-requests')
const { body, matchedData } = require('express-validator')
const auth = require('../middleware/auth')

/*
  Endpoint for creating a user.
  Responds with a session token in payload and set's the token in a session cookie
*/

const registerValidation = [
  body('name').isString().isLength({ max: 30 }),
  body('email').isEmail(),
  body('password').isStrongPassword(),
  validation
]
router.post('/register', ...registerValidation, async (req, res) => {
  const userId = await addUser(req.body.name, req.body.email, req.body.password)

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
const loginValidation = [
  body('email').isString(),
  body('password').isString(),
  validation
]
router.post('/login', ...loginValidation, async function (req, res) {
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

router.all('/data', auth)
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

const userDataValidation = [
  body('name').optional().isString().isLength({ min: 3, max: 30 }),
  body('prefs.linkTTL').optional().isInt({ min: 1, max: 10 }),
  body('prefs.linkOrder').optional().isIn(['asc', 'desc']),
  body('prefs.doneSound').optional().isBoolean({ strict: true }),
  validation
]
router.patch('/data', ...userDataValidation, async function (req, res) {
  const changes = matchedData(req)
  const updatedUser = await updateUser(req.userId, changes)
  if (updatedUser) {
    res.json({
      result: 'success',
      data: {
        name: updatedUser.name,
        email: updatedUser.email,
        prefs: updatedUser.prefs
      }
    })
  } else {
    res.status(500).json(new ErrorResponse('db error'))
  }
})

const resetPasswordValidation = [
  body('email').isEmail(),
  validation
]
router.post('/resetPassword', ...resetPasswordValidation, async (req, res) => {
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

const updatePasswordValidation = [
  body('token').isString(),
  body('password').isStrongPassword(),
  validation
]
router.post('/updatePassword', updatePasswordValidation, async (req, res) => {
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

function sendResetEmail (email, token) {
  // TODO: implement this after paying for mail service
  return true
}

module.exports = router
