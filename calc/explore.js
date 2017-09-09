const rand = require("./rand")
const ref = require("./reference")

const initialValues = function(realm,avatar) {
  var skill = avatar.skills.elements[realm.element]
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
  console.log(rarity,realm.level)
  return Math.pow(realm.level,1.5) / rarity
}

const singleResult = function(realm,avatar,initial) {
  var result = {}
  result.experience = realm.level * initial.tickFrequency
  result.resource = chooseResource(realm,avatar)
  result.resourceQuantity = calculateResourceQuantity(realm,avatar,result.resource)
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

module.exports = {
  initialValues,
  explore,
  chooseResource,
  calculateResourceQuantity
}