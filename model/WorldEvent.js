let mongoose = require('mongoose');
let config = require("../server/config/config");
let avatarSchema = require("./Avatar").schema;
let resourceSchema = require("./ResourceModel").schema;

let schema = new mongoose.Schema({
  _id: String,
  eventType:String,
  expiry:Number,
  battleEvent:{
    avatar:avatarSchema,
    _id:false
  },
  mineEvent:{
    productionRate:Number,
    resources:[resourceSchema],
    _id:false
  }
});

module.exports = {
  schema: schema,
  model: mongoose.model('WorldEvent',schema)
};