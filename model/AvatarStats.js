var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  _id: String,

  //Calculated value of skills
  skills: [
    {id:Number,level:Number, _id:false},
  ],

  //Calculated values of other avatar attributes
  otherStats: [
    {id:String,value:Number,_id:false}
  ],
  
})


schema.methods.skill = function(skillId) {
  var skill = this.skills.find((x) => x.id == skillId)
  if (skill) {
    return skill.level
  } else {
    return 0  
  }
}

schema.methods.other = function(id) {
  var other = this.otherStats.find((x) => x.id == id)
  if (other) {
    return other.value
  } else {
    return 0
  }
}

schema.methods.setSkill = function(skillId,level) {
  var skill = this.skills.find((x) => x.id == skillId)
  if (skill) {
    skill.level = level;
  } else {
    this.skills.push({id:skillId,level:level})
  }
}

schema.methods.setOther = function(id,value) {
  var other = this.otherStats.find((x) => x.id == id)
  if (other) {
    other.value = value
  } else {
    this.otherStats.push({id:id,value:value})
  }
}

module.exports = {
  schema: schema,
  model: mongoose.model('AvatarStats',schema)
}