class RequestError extends Error {
    constructor(...args) {
        super(...args)
        this.name = "RequestValidationError"
        Error.captureStackTrace(this, RequestError)
    }
}

module.exports = {
  RequestError
};