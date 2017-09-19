var mongoose = require('mongoose');
var itemSchema = require("./AvatarItem").schema

var schema = new mongoose.Schema({
  _id: String,
  skills: [
    {id:Number,level:Number,xp:Number,xpNext:Number, _id:false},
  ],
  items: [
    {slot:String,item:itemSchema,_id:false}
  ],
  name:String,
  level:Number,
  health:Number,
  speed:Number,
  currentHealth:Number
})

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

schema.methods.elementalSkills = function() {
  return this.skills.slice(0,9) //TODO: Might need refactoring
}

schema.methods.elementalLevel = function() {
  return this.elementalSkills().reduce((total,s) => {return total + s.level},0)
}


module.exports = {
  schema: schema,
  model: mongoose.model('Avatar',schema)
}