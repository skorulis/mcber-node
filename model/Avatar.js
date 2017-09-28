let mongoose = require('mongoose');
let itemSchema = require("./AvatarItem").schema;
let statsSchema = require("./AvatarStats").schema;

let schema = new mongoose.Schema({
  _id: String,
  skills: [
    {id:String,level:Number,xp:Number,xpNext:Number, _id:false},
  ],
  items: [
    {slot:String,item:itemSchema,_id:false}
  ],
  stats:statsSchema,
  name:String,
  level:Number,
  currentHealth:Number
});

schema.methods.findSkill = function(skillId) {
  return this.skills.find((x) => x.id == skillId)
}

schema.methods.itemAt = function(slot) {
  var space = this.items.find((x) => x.slot == slot)
  return space ? space.item : null
}

schema.methods.setItem = function(item,slot) {
  var space = this.items.find((x) => x.slot == slot)
  if (space) {
    var oldItem = space.item
    space.item = item
    return oldItem
  } else {
    space = {slot:slot, item:item}
    this.items.push(space)
    return null
  }
}

schema.methods.skillLevel = function(skillId) {
  return this.findSkill(skillId).level
}


module.exports = {
  schema: schema,
  model: mongoose.model('Avatar',schema)
}