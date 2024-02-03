const morgan = require('morgan')

morgan.token('url', (req, res) => {
  const url = req.originalUrl || req.url
  return url.replace(/([?&]url=)[^&]*/i, (match, p1) => `${p1}<REDACTED>`)
})

module.exports = () => morgan('[request] :method :url :status :response-time[0] ms - :res[content-length] B')
