let mongoose = require('mongoose');
let config = require("../server/config/config");
let modSchema = require("./ItemMod").schema;

let schema = new mongoose.Schema({
  _id: String,
  type: String,
  refId: String,
  mods:[modSchema]
});

module.exports = {
  schema: schema,
  model: mongoose.model('AvatarItem',schema)
};