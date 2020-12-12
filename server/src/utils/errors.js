class ErrorResponse {
  constructor (message) {
    this.error = true
    this.reason = message
  }
}

class InvalidJSONResponse extends ErrorResponse {
  constructor (invalidProps) {
    super()
    this.invalidProps = invalidProps
    this.reason = invalidProps.join(', ')
    if (invalidProps.length > 1) {
      this.reason += ' are invalid'
    } else {
      this.reason += ' is invalid'
    }
  }
}

module.exports = {
  ErrorResponse,
  InvalidJSONResponse
}
