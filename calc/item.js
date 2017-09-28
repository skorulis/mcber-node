const ref = require("./reference");
const rand = require("./rand");
const gen = require("./generate");
const Counter = require("../util/Counter");
const ItemMod = require("../model").ItemMod;

const itemGenInfo = function(power,elementId) {
  return {
    initialPower:power,
    currentPower:power,
    coreElement:elementId
  }
};

const chooseElement = function(modRef, info) {
  console.log(modRef);
  let number = rand.getRandomInt(0,100);

  //Check if we have picked the index of an element
  if (number < ref.elements.length) { 
    if (modRef.elementalMultiplier > 0) {
      return number
    }
  }

  //TOOD: Add option for picking a trade

  //Use the core element used to generate this item
  if (modRef.elementalMultiplier > 0) {
    return info.coreElement
  }

  //TODO: Handle no core element and non plain items

  //Resort to plain
  return null
};

const attemptMod = function(info) {
  if (info.currentPower == 0) {
    return null
  }
  var index = rand.getRandomInt(0, ref.mods.array.length - 1);
  var modRef = ref.mods.atIndex(index);
  var elementId = chooseElement(modRef,info);
  const maxPowerMult = Math.floor(Math.pow(info.initialPower, 0.5));
  var powerMult = rand.getRandomInt(1,maxPowerMult);

  let mod = new ItemMod({refId:modRef.id,power:powerMult,elementId:elementId});

  if (modPower(mod) > info.currentPower) {
    return null
  }

  return mod
};

const modPower = function(mod) {
  let modRef = ref.getMod(mod.refId);
  return modRef.power * mod.power
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

const fixedItem = function(refType,mods) {
  let item = gen.emptyItem(refType);
  for (m of mods) {
    item.mods.push(m)
  }
  return item
};

const fixedMod = function(refType,power,elementId) {
  return new ItemMod({refId:refType.id,power:power,elementId:elementId});
};

const requiredResources = function(item) {
  let resources = new Counter();
  let itemRef = ref.baseItems.withId(item.name);
  for (r of itemRef.resources) {
    resources.add(r.id,r.quantity)
  }
  return resources.asNamedArray("id","quantity")
};

const breakdown = function(item) {
  var resources = requiredResources(item)
  resources = resources.map(function(x) { 
    return {id:x.id, quantity:Math.floor(x.quantity/2)} 
  })
  resources = resources.filter((x) => x.quantity > 0)
  return resources
}

module.exports = {
  randomItem,
  fixedItem,
  fixedMod,
  attemptMod,
  itemGenInfo,
  chooseElement,
  requiredResources,
  breakdown
};