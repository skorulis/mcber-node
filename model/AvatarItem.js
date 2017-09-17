var mongoose = require('mongoose');
var config = require("../server/config/config")

var schema = new mongoose.Schema({
  _id: String,
  type: String,
  name: String
})

module.exports = {
  schema: schema,
  model: mongoose.model('AvatarItem',schema)
}