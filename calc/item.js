const ref = require("./reference")
const rand = require("./rand")
const gen = require("./generate")

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

module.exports = {
  randomItem,
  attemptMod,
  itemGenInfo,
  chooseElement
}