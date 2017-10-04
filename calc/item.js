const ref = require("./reference");
const rand = require("./rand");
const gen = require("./generate");
const Counter = require("../util/Counter");
const ItemMod = require("../model").ItemMod;
const uniqid = require('uniqid');
let ResourceContainer = require("../util/ResourceContainer");

const itemGenInfo = function(power,elementId) {
  return {
    initialPower:power,
    currentPower:power,
    coreElement:ref.getSkill(elementId)
  }
};

const chooseElement = function(modRef, coreElement) {
  let number = rand.getRandomInt(0,100);
  if (modRef.skillType === "none") {
    return null
  }

  let skills = [];
  if (modRef.skillType === "all" || modRef.skillType === "elemental") {
    skills = skills.concat(ref.elements);
  }
  if (modRef.skillType === "all" || modRef.skillType === "trade") {
    skills = skills.concat(ref.trades);
  }

  //Check if we have picked the index of a skill
  if (number < skills.length) {
    return skills[number];
  }

  return coreElement
};

const attemptMod = function(info) {
  if (info.currentPower === 0) {
    return null
  }
  let modRef = ref.mods.randomElement();
  let element = chooseElement(modRef,info.coreElement);
  let elementId = element ? element.id : null;
  const maxPowerMult = Math.floor(Math.pow(info.initialPower, 0.5));
  let powerMult = rand.getRandomInt(1,maxPowerMult);

  let mod = new ItemMod({_id:uniqid(),refId:modRef.id,power:powerMult,elementId:elementId});

  if (modPower(mod) > info.currentPower) {
    return null
  }

  return mod
};

const modPower = function(mod) {
  let modRef = ref.getMod(mod.refId);
  return modRef.levelMult * mod.power
};

const randomItem = function(power,elementId) {
  let index = rand.getRandomInt(0, ref.baseItems.array.length - 1);
  let baseItem = ref.baseItems.atIndex(index);
  let item = gen.emptyItem(baseItem);
  let info = itemGenInfo(power,elementId);

  let usedMods = [];

  while(true) {
    let nextMod = attemptMod(info);
    if (nextMod && !usedMods.includes(nextMod.id)) {
      item.mods.push(nextMod);
      usedMods.push(nextMod.id);
      info.currentPower -= modPower(nextMod)
    } else {
      break
    }
  }

  return item
};

const randomGem = function(power,elementId) {
  let modRef = ref.mods.randomElement();
  let elementRef = ref.skills.withId(elementId);
  let element = chooseElement(modRef,elementRef);
  let powerMult = rand.getRandomInt(1,Math.floor(power/modRef.levelMult));
  let usedElementId = element ? element.id : null;

  let mod = new ItemMod({_id:uniqid(),refId:modRef.id,power:powerMult,elementId:usedElementId});
  return mod;
};

const fixedItem = function(refType,mods) {
  let item = gen.emptyItem(refType);
  for (m of mods) {
    item.mods.push(m)
  }
  return item
};

const fixedMod = function(refType,power,elementId) {
  return new ItemMod({_id:uniqid(),refId:refType.id,power:power,elementId:elementId});
};

const gemRefResources = function(modRef,level,elementRef) {
  let multiplier = Math.pow(level,1.5);
  let resources = new ResourceContainer(modRef.resources,ref.resources,ref.skills,elementRef,multiplier);
  return resources
};

const gemResources = function(gem) {
  let modRef = ref.mods.withId(gem.refId);
  let elementRef = null;
  if (gem.elementId) {
    elementRef = ref.skills.withId(gem.elementId)
  }
  return gemRefResources(modRef,gem.power,elementRef);
};

const itemResources = function(itemRef) {
  return new ResourceContainer(itemRef.resources,ref.resources,ref.skills,null,1);
};

const breakdown = function(item) {
  let itemRef = ref.baseItems.withId(item.refId);
  let resources = itemResources(itemRef);
  for (m of item.mods) {
    resources.addOther(gemResources(m));
  }
  resources = resources.adjustedList;
  resources = resources.map(function(x) { 
    return {id:x.id, quantity:Math.floor(x.quantity/2)} 
  });
  resources = resources.filter((x) => x.quantity > 0);
  return resources
};

const breakdownGem = function (gem) {
  let resources = gemResources(gem);
  resources = resources.adjustedList;
  resources = resources.map(function(x) {
    return {id:x.id, quantity:Math.floor(x.quantity/2)}
  });
  resources = resources.filter((x) => x.quantity > 0);
  return resources
};

module.exports = {
  randomItem,
  randomGem,
  fixedItem,
  fixedMod,
  attemptMod,
  itemGenInfo,
  chooseElement,
  breakdown,
  breakdownGem,
  gemRefResources,
  gemResources,
  itemResources
};