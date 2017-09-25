const ref = require("./reference")
const rand = require("./rand")
const gen = require("./generate")
const Counter = require("../util/Counter")

const itemGenInfo = function(power,elementId) {
  return {
    initialPower:power,
    currentPower:power,
    coreElement:elementId
  }
}

const chooseElement = function(modRef, info) {
  var number = rand.getRandomInt(0,100)

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
}

const attemptMod = function(info) {
  if (info.currentPower == 0) {
    return null
  }
  var index = rand.getRandomInt(0, ref.mods.length - 1)
  var modRef = ref.modAtIndex(index)
  var elementId = chooseElement(modRef,info)
  const maxPowerMult = Math.floor(Math.pow(info.initialPower, 0.5))
  var powerMult = rand.getRandomInt(1,maxPowerMult)

  var mod = {id:modRef.id,power:powerMult,elementId:elementId}
  if (modPower(mod) > info.currentPower) {
    return null
  }

  return mod
}

const modPower = function(mod) {
  var modRef = ref.getMod(mod.id)
  return modRef.power * mod.power
}

const randomItem = function(power,elementId) {
  var index = rand.getRandomInt(0, ref.baseItems.length - 1)
  var baseItem = ref.baseItem(index)
  var item = gen.emptyItem(baseItem)
  var info = itemGenInfo(power,elementId)

  var usedMods = []

  while(true) {
    var nextMod = attemptMod(info)
    if (nextMod && !usedMods.includes(nextMod.id)) {
      item.mods.push(nextMod)
      usedMods.push(nextMod.id)
      info.currentPower -= modPower(nextMod)
    } else {
      break
    }
  }

  return item
}

const fixedItem = function(refType,mods) {
  var item = gen.emptyItem(refType)
  for (m of mods) {
    item.mods.push(m)
  }
  return item
}

const fixedMod = function(refType,power,elementId) {
  return {id:refType.id,power:power,elementId:elementId}
}

const requiredResources = function(item) {
  var resources = new Counter()
  var itemRef = ref.baseItemWithId(item.name)
  for (r of itemRef.resources) {
    resources.add(r.id,r.quantity)
  }
  return resources.asNamedArray("id","quantity")
}

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
}