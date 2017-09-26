const fs = require('fs');
const RefContainer = require("../util/RefContainer");
const skillsData = JSON.parse(fs.readFileSync('static/ref/skills.json', 'utf8')).skills;
const resources = JSON.parse(fs.readFileSync('static/ref/resources.json', 'utf8')).resources;
const modData = JSON.parse(fs.readFileSync('static/ref/itemMods.json', 'utf8')).mods;
const items = JSON.parse(fs.readFileSync('static/ref/items.json', 'utf8')).items;
const baseItems = items.baseTypes;

let skills = new RefContainer(skillsData,"id");
let mods = new RefContainer(modData,"id");

const elements = skills.array.filter((s) => s.type == "elemental")
const baseTypeMap = {}

const getSkill = function(id) {
  return skills.withId(id)
};

const baseItem = function(index) {
  return items.baseTypes[index]
};

const baseItemWithId = function(id) {
  return baseTypeMap[id]
};

const getMod = function(id) {
  return mods.withId(id);
};

for(let e of skills.array) {
  e.resources = [];

  if (e.type == "elemental") {
    e.totalAttack = e.damageModifiers.reduce((total,amount) => total + amount );
    e.totalDefense = skills.array.reduce( (total,element) => {return total + element.damageModifiers[e.index]},0)
  }
}

for (let id in resources.elemental) {
  let r = resources.elemental[id];
  r.id = id;
  getSkill(r.skill).resources.push(r)
}

for (t of items.baseTypes) {
  baseTypeMap[t.name] = t
}

module.exports = {
  skills,
  resources,
  mods,
  items,
  getSkill,
  elements,
  baseItem,
  getMod,
  baseItems,
  baseItemWithId
};