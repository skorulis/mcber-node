let mongoose = require('mongoose');
let config = require("../server/config/config");
let avatarSchema = require("./Avatar").schema;

let schema = new mongoose.Schema({
  _id: String,
  avatar1:avatarSchema,
  avatar2:avatarSchema,
  winnerId:String,
  a1TotalDamage:{type:Number,default:0},
  a2TotalDamage:{type:Number,default:0},
  a1Attacks:[{attackSkillId:String,defenceSkillId:String,damage:Number,_id:false}],
  a2Attacks:[{attackSkillId:String,defenceSkillId:String,damage:Number,_id:false}]

});

module.exports = {
  schema: schema,
  model: mongoose.model('BattleResults',schema)
};