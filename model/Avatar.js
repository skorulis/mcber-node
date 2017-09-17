var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  _id: String,
  skills: {
    elements:[
      {level:Number,xp:Number,xpNext:Number, _id:false},
    ],
    trades:[
      {level:Number,xp:Number,xpNext:Number, _id:false},
    ]
  },
  name:String,
  level:Number,
  health:Number,
  speed:Number,
  currentHealth:Number
})

schema.methods.elementalLevel = function(skillId) {
  return this.skills.elements[skillId].level
}

schema.methods.tradelLevel = function(skillId) {
  return this.skills.trades[skillId].level
}

module.exports = {
  schema: schema,
  model: mongoose.model('Avatar',schema)
}