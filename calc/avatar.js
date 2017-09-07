const fs = require('fs');
const skills = JSON.parse(fs.readFileSync('static/ref/skills.json', 'utf8'));

module.exports = {
  updateStats:function(avatar) {
    avatar.level = avatar.skills.elements.reduce((total,amount) => total + amount)
    avatar.health = avatar.skills.elements.reduce((total,value,index) => total + skills.elements[index].healthModifier * value)
    avatar.speed = avatar.skills.elements.reduce((total,value,index) => total + skills.elements[index].speedModifier * value)
    return avatar
  }
}