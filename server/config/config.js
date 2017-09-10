if (process.env.NODE_ENV == "test") {
  module.exports = {
    skipWaiting:true
  }
} else {
  module.exports = {
    skipWaiting:false
  }
}