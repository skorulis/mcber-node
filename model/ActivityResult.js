let mongoose = require('mongoose');
let modSchema = require("./ItemMod").schema;
let itemSchema = require("./AvatarItem").schema;
let battleResultSchema = require("./BattleResults").schema;
let resourceSchema = require("./ResourceModel").schema;
let avatarSchema = require("./Avatar").schema;

let schema = new mongoose.Schema({
  _id: String,
  success:Boolean,
  currency:Number,
  item:{type:itemSchema,default:null},
  gem:{type:modSchema,default:null},
  realmUnlock:{type:{elementId:String,level:Number,_id:false},default:null},
  resources:[resourceSchema],
  experience:[{skillId:String,xp:Number,_id:false}],
  foundAvatar:avatarSchema,
  battleResult:{type:battleResultSchema,default:null}
});

schema.methods.addExperience = function(skillId,amount) {
  for(let xp of this.experience) {
    if (xp.skillId === skillId) {
      xp.xp = xp.xp + amount;
      return
    }
  }
  this.experience.push({skillId:skillId,xp:amount})
};

module.exports = {
  schema: schema,
  model: mongoose.model('ActivityResult',schema)
};