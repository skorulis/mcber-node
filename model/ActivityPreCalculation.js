let mongoose = require('mongoose');
let resourceSchema = require("./ResourceModel").schema;

let schema = new mongoose.Schema({
  duration:Number,
  difficulty:Number,
  usedSkills:[String],
  skillLevel:Number,
  resources:[resourceSchema],
  failureChance:Number,
  _id:false
});

module.exports = {
  schema: schema,
  model: mongoose.model('ActivityPreCalculation',schema)
};