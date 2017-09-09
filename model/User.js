var mongoose = require('mongoose');
var avatarSchema = require("./Avatar").schema

var userSchema = new mongoose.Schema({
  _id: String,
  password: String,
  email: String,
  fbid: String,
  avatars:[avatarSchema]
})

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