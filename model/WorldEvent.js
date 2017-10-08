let mongoose = require('mongoose');
let config = require("../server/config/config");
let avatarSchema = require("./Avatar").schema;

let schema = new mongoose.Schema({
  _id: String,
  eventType:String,
  expiry:Number,
  realm:{
    elementId:String,
    level:Number,
    _id:false
  },
  avatar:avatarSchema
});

module.exports = {
  schema: schema,
  model: mongoose.model('WorldEvent',schema)
};