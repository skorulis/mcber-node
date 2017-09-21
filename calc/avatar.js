const ref = require("./reference")

module.exports = {
  updateStats:function(avatar) {
    avatar.level = avatar.skills.reduce((total,s) => {return total + s.level},0)
    avatar.health = avatar.skills.reduce((total,s,index) => {return total + ref.getSkill(s.id).healthModifier * s.level},10)
    avatar.speed = avatar.skills.reduce((total,s,index) => {return total + ref.getSkill(s.id).speedModifier * s.level},100)
    return avatar
  }
}