var mongoose = require('mongoose');
var config = require("../server/config/config")

var schema = new mongoose.Schema({
  _id: String,
  type: String,
  name: String,
  mods:[
    {id:String, power:Number, elementId:String, _id:false}
  ]
})

module.exports = {
  schema: schema,
  model: mongoose.model('AvatarItem',schema)
}