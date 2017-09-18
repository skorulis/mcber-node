const fs = require('fs');
const skills = JSON.parse(fs.readFileSync('static/ref/skills.json', 'utf8')).skills;
const resources = JSON.parse(fs.readFileSync('static/ref/resources.json', 'utf8')).resources;
const mods = JSON.parse(fs.readFileSync('static/ref/itemMods.json', 'utf8')).mods;
const items = JSON.parse(fs.readFileSync('static/ref/items.json', 'utf8')).items;

var skillIndex = []
var modIndex = []
const elements = skills.filter((s) => s.type == "elemental")

const getSkill = function(id) {
  return skillIndex[id]
}

const baseItem = function(index) {
  return items.baseTypes[index]
}

const modAtIndex = function(index) {
  return mods[index]
}

const getMod = function(id) {
  return modIndex[id]
}

for(e of skills) {
  skillIndex[e.id] = e;
  e.resources = []

  if (e.type == "elemental") {
    e.totalAttack = e.damageModifiers.reduce((total,amount) => total + amount )
    e.totalDefense = skills.reduce( (total,element) => {return total + element.damageModifiers[e.index]},0)
  }
}

for (var id in resources.elemental) {
  var r = resources.elemental[id]
  r.id = id;
  getSkill(r.skill).resources.push(r)
}

for (m of mods) {
  modIndex[m.id] = m
}

module.exports = {
  skills,
  resources,
  mods,
  items,
  getSkill,
  elements,
  baseItem,
  modAtIndex,
  getMod
}