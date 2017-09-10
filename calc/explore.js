const rand = require("./rand")
const ref = require("./reference")

const initialValues = function(realm,avatar) {
  var skill = avatar.elementalLevel(realm.element)
  return {
    tickFrequency: 30 * realm.level * realm.level / (skill + 1)
  }
}

const chooseResource = function(realm,avatar) {
  var skill = ref.skills.elements[realm.element]
  return skill.resources[0]
}

const calculateResourceQuantity = function(realm,avatar,resource) {
  var rarity = resource.rarity || 1
  return Math.pow(realm.level,1.5) / rarity
}

const singleResult = function(realm,avatar,initial) {
  var result = {}
  result.experience = realm.level * initial.tickFrequency
  var resource = chooseResource(realm,avatar)
  var quantity = calculateResourceQuantity(realm,avatar,resource)
  result.resource = {id:resource.id,quantity:quantity}
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