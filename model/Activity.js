var mongoose = require('mongoose');
var config = require("../server/config/config")

var schema = new mongoose.Schema({
  _id: String,
  avatarId:String,
  activityType:String,
  startTimestamp:{type:Number},
  calculated: {
    duration:Number,
    skillLevel:Number,
    _id:false
  },
  realm: {
    elementId:Number,
    level:Number,
    _id:false
  }
})

schema.methods.isComplete = function() {
  if (config.skipWaiting) {
    return true
  }
  var time = Math.floor(Date.now() / 1000);
  return time >= this.startTimestamp + this.calculated.duration
}

module.exports = {
  schema: schema,
  model: mongoose.model('Activity',schema)
}