let rand = require("./rand");
let ref = require("./reference");
let xp = require("./experience");
let gen = require("./generate");

let kMineSkill = "101";

const initialValues = function(realm,avatar) {
  let skill = avatar.stats.skill(realm.elementId);
  skill += avatar.stats.skill(kMineSkill);
  let time = 30 * Math.pow(realm.level, 2) / (skill + 1);
  let result = gen.baseActivityCalculation(time);
  result.skillLevel = skill;
  result.usedSkills = [realm.elementId,kMineSkill];
  result.difficulty = realm.level;
  return result;
};

const getResult = function(realm,avatar,initial) {
  let result = gen.baseActivityResult();
  result.experience = xp.craftGain(initial);

  return result;
};

const getActivity = function(realm,avatar) {

};

const completeActivity = function(activity,avatar) {

};

module.exports = {
  initialValues,
  getResult,
  getActivity,
  completeActivity
};