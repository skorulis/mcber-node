const rand = require("./rand")
const ref = require("./reference")
const xp = require("./experience")
const item = require("./item")

const kCraftSkill = 102;

const itemSkillAffiliation = function(itemRef) {
  var ret = {}
  for (r of itemRef.resources) {
    
  }
}

const initialValues = function(itemRef,avatar) {
  var skill = avatar.stats.skill(realm.elementId)
  skill += avatar.stats.skill(kExploreSkill)
  var time = 30 * realm.level * realm.level / (skill + 1)
  time = Math.max(time,2)
  return {
    skillLevel:skill,
    duration: time
  }
}


module.exports = {
  initialValues
}