let mongoose = require('mongoose');
let config = require("../server/config/config");
let modSchema = require("./ItemMod").schema;
let itemSchema = require("./AvatarItem").schema;

let schema = new mongoose.Schema({
  _id: String,
  success:Boolean,
  currency:Number,
  item:{type:itemSchema,default:null},
  gem:{type:modSchema,default:null},
  realmUnlock:{type:{elementId:String,level:Number,_id:false},default:null},
  resources:[{id:String,quantity:Number,_id:false}],
  experience:[{skillId:String,xp:Number,_id:false}],
});

module.exports = {
  schema: schema,
  model: mongoose.model('ActivityResult',schema)
};