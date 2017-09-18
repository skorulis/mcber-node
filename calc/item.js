const ref = require("./reference")
const rand = require("./rand")
const gen = require("./generate")

const itemGenInfo = function(power,elementId) {
  return {
    initialPower:power,
    currentPower:power,
    genElement:elementId
  }
}

const attemptMod = function(info) {
  if (info.currentPower == 0) {
    return null
  }
  var index = rand.getRandomInt(0, ref.mods.length - 1)
  var modRef = ref.modAtIndex(index)
  const maxPowerMult = Math.floor(Math.pow(info.initialPower, 0.5))
  var powerMult = rand.getRandomInt(1,maxPowerMult)

  var mod = {id:modRef.id,power:powerMult}
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
  var index = rand.getRandomInt(0, ref.items.length)
  var baseItem = ref.baseItem(index)
  var item = gen.emptyItem(baseItem)
  var info = itemGenInfo(power,elementId)

  while(true) {
    var nextMod = attemptMod(info)
    if (nextMod) {
      item.mods.push(nextMod)
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
  itemGenInfo
}