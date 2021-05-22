const { validationResult } = require('express-validator')

/** 
 * Middleware to be used at the end of an ```express-validator``` chain. 
 * Completes the request and responds with status code ```400``` if there were any errors in the 
 * chain.
 */
module.exports = (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() })
  } else {
    next()
  }
}
