const AvatarStats = require("../model").AvatarStats;
const ref = require("./reference");

const kStatIdHealth = "1";
const kStatIdSpeed = "2";

const avatarStats = function(avatar) {
  var stats = AvatarStats()
  var health = avatar.skills.reduce((total,s,index) => {return total + ref.getSkill(s.id).healthModifier * s.level},10)
  var speed = avatar.skills.reduce((total,s,index) => {return total + ref.getSkill(s.id).speedModifier * s.level},100)

  for (skill of avatar.skills) {
    stats.setSkill(skill.id,skill.level)
  }

  var allMods = []
  for (itemSlot of avatar.items) {
    var item = itemSlot.item
    if (item) {
      allMods = allMods.concat(item.mods)
    }
  }

  for (mod of allMods) {
    if (mod.refId == "+skill") {
      var old = stats.skill(mod.elementId)
      old += mod.power
      stats.setSkill(mod.elementId,old)
    }
  }

  stats.setOther(kStatIdHealth,health)
  stats.setOther(kStatIdSpeed,speed)

  return stats
}

module.exports = {
  avatarStats,
  kStatIdHealth,
  kStatIdSpeed
}