const morgan = require('morgan')

// Sanitize URL parameters
morgan.token('url', (req, res) => {
  const url = req.originalUrl || req.url
  return url.replace(/([?&]url=)[^&]*/i, (match, p1) => `${p1}<REDACTED>`)
})

// Re-add status colors in development
if (process.env.NODE_ENV === 'development') {
  morgan.token('status', (req, res) => {
    const status = (typeof res.headersSent !== 'boolean'
      ? Boolean(res._header)
      : res.headersSent)
      ? res.statusCode
      : '-'

    // get status color
    const color =
          status >= 500
            ? 31 // red
            : status >= 400
              ? 33 // yellow
              : status >= 300
                ? 36 // cyan
                : status >= 200
                  ? 32 // green
                  : 0 // no color
    return `\x1b[${color}m${status}\x1b[0m`
  })
}

module.exports = () => morgan('[request] :method :url :status :response-time[0] ms - :res[content-length] B')
