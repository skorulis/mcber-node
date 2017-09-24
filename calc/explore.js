const rand = require("./rand")
const ref = require("./reference")
const xp = require("./experience")
const item = require("./item")

const kExploreSkill = 104

const initialValues = function(realm,avatar) {
  var skill = avatar.stats.skill(realm.elementId)
  skill += avatar.stats.skill(kExploreSkill)
  var time = 30 * realm.level * realm.level / (skill + 1)
  time = Math.max(time,2)
  return {
    skillLevel:skill,
    tickFrequency: time
  }
}

const chooseResource = function(realm,avatar) {
  var skill = ref.getSkill(realm.elementId)
  return skill.resources[0]
}

const calculateResourceQuantity = function(realm,avatar,resource) {
  var rarity = resource.rarity || 1
  return Math.round(Math.pow(realm.level,1.5) / rarity)
}

const singleResult = function(realm,avatar,initial) {
  var result = {}
  result.experience = xp.exploreGain(realm, initial.tickFrequency)
  var resource = chooseResource(realm,avatar)
  var quantity = calculateResourceQuantity(realm,avatar,resource)
  result.resource = {id:resource.id,quantity:quantity}
  if (rand.getRandomInt(0,100) > 90) { //10% chance to unlock a realm)
    result.realmUnlock = {elementId:realm.elementId,level:realm.level + 1}
  }
  if (rand.getRandomInt(0,100) > 90) { //10% chance of getting an item
    var maxPower = realm.level
    result.item = item.randomItem(maxPower,realm.elementId)
  }

  return result
}

//Calculates the results of exploring for this length of time, no changes are made
const explore = function(realm,avatar,time) {
  var constants = initialValues(realm,avatar)
  var ticks = Math.floor(time / constants.tickFrequency)
  var results = []
  for(var i = 0; i < ticks; ++i) {
    results.push(singleResult(realm,avatar,constants))
  }

  return results
}

const exploreActivity = function(activity,avatar) {
  var constants = initialValues(activity.realm,avatar)

  //TODO: Decide if I should be handling multiple results
  return singleResult(activity.realm,avatar,constants)
}

module.exports = {
  initialValues,
  explore,
  chooseResource,
  calculateResourceQuantity,
  exploreActivity
}