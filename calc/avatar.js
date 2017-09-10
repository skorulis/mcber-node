const fs = require('fs');
const skills = JSON.parse(fs.readFileSync('static/ref/skills.json', 'utf8'));

module.exports = {
  updateStats:function(avatar) {
    avatar.level = avatar.skills.elements.reduce((total,element) => {return total + element.level},0)
    avatar.health = avatar.skills.elements.reduce((total,element,index) => {return total + skills.elements[index].healthModifier * element.level},0)
    avatar.speed = avatar.skills.elements.reduce((total,element,index) => {return total + skills.elements[index].speedModifier * element.level},0)
    return avatar
  }
}