var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
  _id: String,
  password: String,
  email: String
})

module.exports = {
  schema: userSchema,
  model: mongoose.model('User',userSchema)
}