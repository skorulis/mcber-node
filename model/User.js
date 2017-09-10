var mongoose = require('mongoose');
var avatarSchema = require("./Avatar").schema
var activitySchema = require("./Activity").schema

var userSchema = new mongoose.Schema({
  _id: String,
  password: String,
  email: String,
  fbid: String,
  avatars:[avatarSchema],
  activities:[activitySchema],
  resources:[Number]
})

userSchema.methods.avatarActivity = function(avatarId) {
  for (a of this.activities) {
    if (a.avatarId == avatarId) {
      return a;
    }
  }
  return null;
}

userSchema.methods.findAvatar = function(avatarId) {
  return this.avatars.find((a) => a._id == avatarId)
}

userSchema.methods.findActivity = function(activityId) {
  return this.activities.find( (a) => a._id == activityId)
}

userSchema.methods.removeActivity = function(activityId) {
  this.activities = this.activities.filter((a) => a._id != activityId)
}

userSchema.methods.toJSON = function() {
  var obj = this.toObject()
  delete obj.password
  delete obj.__v
  return obj
}

module.exports = {
  schema: userSchema,
  model: mongoose.model('User',userSchema)
}