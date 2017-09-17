const fs = require('fs');
const skills = JSON.parse(fs.readFileSync('static/ref/skills.json', 'utf8')).skills;
const resources = JSON.parse(fs.readFileSync('static/ref/resources.json', 'utf8')).resources;
const mods = JSON.parse(fs.readFileSync('static/ref/itemMods.json', 'utf8')).mods;
const items = JSON.parse(fs.readFileSync('static/ref/items.json', 'utf8')).items;

for(e of skills.elements) {
  e.totalAttack = e.damageModifiers.reduce((total,amount) => total + amount )
  e.totalDefense = skills.elements.reduce( (total,element) => {return total + element.damageModifiers[e.index]},0)
  e.resources = []
}

for (var id in resources.elemental) {
  var r = resources.elemental[id]
  r.id = id;
  skills.elements[r.skill].resources.push(r)
}

module.exports = {
  skills,
  resources,
  mods,
  items
}