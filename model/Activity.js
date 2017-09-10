var mongoose = require('mongoose');
var config = require("../server/config/config")

var schema = new mongoose.Schema({
  _id: String,
  avatarId:String,
  activityType:String,
  startTimestamp:{type:Number,default:Math.floor(Date.now() / 1000)},
  finishTimestamp:Number,
  realm: {
    element:Number,
    level:Number
  }
})

schema.methods.isComplete = function() {
  if (config.skipWaiting) {
    return true
  }
  var time = Math.floor(Date.now() / 1000);
  return time >= this.finishTimestamp
}

module.exports = {
  schema: schema,
  model: mongoose.model('Activity',schema)
}