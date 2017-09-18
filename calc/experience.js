const typeElemental = "elemental";
const typeTrade = "trade";

const tradeSkillMine = 101;
const tradeSkillCraft = 102;
const tradeSkillBattle = 103;
const tradeSkillExplore = 104;
const tradeSkillResearch = 105;


//Calculates how much experience to go from level-1 -> level
const elementalRequirement = function(level) {
  return Math.floor(Math.pow(level,1.5) * 50)
}

//Returns all the experience gained exploring the given realm for that amount of time
const exploreGain = function(realm,time) {
  return [
    {type:typeElemental,xp:realm.level*time,skillId:realm.elementId},
    {type:typeTrade,xp:realm.level*time,skillId:tradeSkillExplore},
  ]
}

const addExperienceToSkill = function(skillXpProgress,xpObject) {
  var xpTotal = skillXpProgress.xp + xpObject.xp
    while(xpTotal >= elementalRequirement(skillXpProgress.level + 1)) {
      xpTotal -= elementalRequirement(skillXpProgress.level + 1);
      skillXpProgress.level = skillXpProgress.level + 1;
    }
    skillXpProgress.xp = xpTotal
    skillXpProgress.xpNext = elementalRequirement(skillXpProgress.level + 1)
}

const addExperience = function(avatar,xpObject) {
  var skill = avatar.findSkill(xpObject.skillId)
  addExperienceToSkill(skill,xpObject)
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