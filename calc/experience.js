
//Calculates how much experience to go from level-1 -> level
const elementalRequirement = function(level) {
  return Math.floor(Math.pow(level,1.5) * 50)
}

//Returns all the experience gained exploring the given realm for that amount of time
const exploreGain = function(realm,time) {
  return [{type:"elemental",xp:realm.level*time,elementId:realm.element}]
}

const addExperience = function(avatar,xpObject) {
  if (xpObject.type == "elemental") {
    var element = avatar.skills.elements[xpObject.elementId]
    var xpTotal = element.xp + xpObject.xp
    while(xpTotal >= elementalRequirement(element.level + 1)) {
      xpTotal -= elementalRequirement(element.level + 1);
      element.level = element.level + 1;
    }
    element.xp = xpTotal
    element.nextXP = elementalRequirement(element.level + 1)
  } else {

  }
}

const addAllExperience = function(avatar,xpList) {
  for (xp of xpList) {
    addExperience(avatar,xp)
  }
}

module.exports = {
  addExperience,
  addAllExperience,
  elementalRequirement,
  exploreGain
}