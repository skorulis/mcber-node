let mongoose = require('mongoose');
let config = require("../server/config/config");
let calculatedSchema = require("./ActivityPreCalculation").schema;

let schema = new mongoose.Schema({
  _id: String,
  avatarId:String,
  activityType:String,
  startTimestamp:{type:Number},
  itemId:String,
  gem:{
    elementId:String,
    modId:String,
    level:Number,
    _id:false
  },
  socketGem:{
    itemId:String,
    gemId:String,
    _id:false
  },
  calculated: calculatedSchema,
  realm: {
    elementId:String,
    level:Number,
    _id:false
  }
});

schema.methods.isComplete = function() {
  if (config.skipWaiting) {
    return true
  }
  let time = Math.floor(Date.now() / 1000);
  return time >= this.startTimestamp + this.calculated.duration
};

module.exports = {
  schema: schema,
  model: mongoose.model('Activity',schema)
};