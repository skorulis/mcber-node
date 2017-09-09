var mongoose = require('mongoose');

var avatarSchema = new mongoose.Schema({
  _id: String,
  skills: {
    elements:[Number]
  },
  level:Number,
  health:Number,
  speed:Number,
  currentHealth:Number
})

module.exports = {
  schema: avatarSchema,
  model: mongoose.model('Avatar',avatarSchema)
}