const fs = require('fs');
const RefContainer = require("../util/RefContainer");
const skillsData = JSON.parse(fs.readFileSync('static/ref/skills.json', 'utf8')).skills;
const resourceData = JSON.parse(fs.readFileSync('static/ref/resources.json', 'utf8')).resources;
const modData = JSON.parse(fs.readFileSync('static/ref/itemMods.json', 'utf8')).mods;
const items = JSON.parse(fs.readFileSync('static/ref/items.json', 'utf8')).items;

let skills = new RefContainer(skillsData,"id");
let mods = new RefContainer(modData,"id");
let baseItems = new RefContainer(items.baseTypes,"name");
let resources = new RefContainer(resourceData,"id");

const elements = skills.array.filter((s) => s.type == "elemental");
const trades = skills.array.filter((s) => s.type == "trade");

const getSkill = function(id) {
  return skills.withId(id)
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

for (r of resources.array) {
  getSkill(r.skill).resources.push(r)
}

module.exports = {
  skills,
  resources,
  mods,
  items,
  getSkill,
  elements,
  trades,
  getMod,
  baseItems
};