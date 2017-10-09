let mongoose = require('mongoose');

let schema = new mongoose.Schema({
  duration:Number,
  difficulty:Number,
  usedSkills:[String],
  skillLevel:Number,
  resources:[{id:String,quantity:Number,_id:false}],
  failureChance:Number,
  _id:false
});

module.exports = {
  schema: schema,
  model: mongoose.model('ActivityPreCalculation',schema)
};