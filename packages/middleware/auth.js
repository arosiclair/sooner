const { getSession, refreshSession } = require('@sooner/data-access/sessions')
const { ErrorResponse } = require('@sooner/responses/errors')

/**
 * Authentication middleware that verifies a valid session.
 * Expects the token to be set at ```req.session.token```
 * or ```req.body.token```
 * Responds with status 401 if session is invalid
 */
module.exports = async (req, res, next) => {
  const token = req.body.token || req.session.token

  if (token) {
    try {
      var session = await getSession(token)
    } catch (error) {
      return next(error)
    }

    if (session) {
      // attach the user's mongo ID for easy access
      req.userId = session.userId

      // extend this session in the DB and in the user's cookie
      const aMinuteAgo = new Date()
      aMinuteAgo.setMinutes(aMinuteAgo.getMinutes() - 1)

      if (!session.updatedAt || session.updatedAt < aMinuteAgo) {
        refreshSession(token)
      }
      req.session.lastActivity = Math.floor(Date.now() / 60e3)
 
      next()
    } else {
      res.status(401).json(new ErrorResponse('invalid session'))
    }
  } else {
    res.status(401).json(new ErrorResponse('no token found'))
  }
}
