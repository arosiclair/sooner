const { getSession } = require('../daos/sessions')
const { ErrorResponse } = require('../utils/errors')

/**
 * Authentication middleware that verifies a valid session.
 * Expects the token to be set at ```req.session.token```
 * or ```req.body.token```
 * Responds with status 401 if session is invalid
 */
module.exports = async (req, res, next) => {
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
