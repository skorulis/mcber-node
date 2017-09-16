var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  _id: String,
  skills: {
    elements:[
      {level:Number,xp:Number,xpNext:Number, _id:false},
    ]
  },
  level:Number,
  health:Number,
  speed:Number,
  currentHealth:Number
})

schema.methods.elementalLevel = function(elementId) {
  return this.skills.elements[elementId].level
}

module.exports = {
  schema: schema,
  model: mongoose.model('Avatar',schema)
}