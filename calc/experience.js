const tradeSkillMine = "101";
const tradeSkillCraft = "102";
const tradeSkillBattle = "103";
const tradeSkillExplore = "104";
const tradeSkillResearch = "105";


//Calculates how much experience to go from level-1 -> level
const elementalRequirement = function(level) {
  return Math.floor(Math.pow(level,1.5) * 50)
};

//Returns all the experience gained exploring the given realm for that amount of time
const exploreGain = function(realm,time) {
  let amount = Math.round(realm.level*time + realm.level * 10);
  return [
    {xp:amount,skillId:realm.elementId},
    {xp:amount,skillId:tradeSkillExplore},
  ]
};

let craftGain = function(initial) {
  let amount = Math.round(initial.duration);
  return initial.usedSkills.map(function(sId) {
    return {xp:amount,skillId:sId}
  })
};

const addExperienceToSkill = function(skillXpProgress,xpObject) {
  let xpTotal = skillXpProgress.xp + xpObject.xp;
    while(xpTotal >= elementalRequirement(skillXpProgress.level + 1)) {
      xpTotal -= elementalRequirement(skillXpProgress.level + 1);
      skillXpProgress.level = skillXpProgress.level + 1;
    }
    skillXpProgress.xp = xpTotal;
    skillXpProgress.xpNext = elementalRequirement(skillXpProgress.level + 1)
};

const addExperience = function(avatar,xpObject) {
  let skill = avatar.findSkill(xpObject.skillId);
  addExperienceToSkill(skill,xpObject)
};

const addAllExperience = function(avatar,xpList) {
  for (xp of xpList) {
    addExperience(avatar,xp)
  }
};

module.exports = {
  addExperience,
  addAllExperience,
  elementalRequirement,
  exploreGain,
  craftGain
};