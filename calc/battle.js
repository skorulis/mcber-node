const fs = require('fs');
const skills = JSON.parse(fs.readFileSync('static/ref/skills.json', 'utf8'));

//Get the result from avatar 1 attacking avatar 2. No changes are made
const attack = function(a1,a2) {
  return {}
}

module.exports = {
  attack:attack
}