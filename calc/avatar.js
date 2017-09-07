const fs = require('fs');
const skills = JSON.parse(fs.readFileSync('static/ref/skills.json', 'utf8'));

module.exports = {
  updateStats:function(avatar) {
    avatar.level = avatar.skills.reduce((total,amount) => total + amount)
    avatar.health = avatar.skills.reduce((total,value,index) => total + skills.elements[index].healthModifier * value)
    avatar.speed = avatar.skills.reduce((total,value,index) => total + skills.elements[index].speedModifier * value)
    return avatar
  }
}