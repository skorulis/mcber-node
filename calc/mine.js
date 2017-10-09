let rand = require("./rand");
let ref = require("./reference");
let xp = require("./experience");

let kMineSkill = "101";

const initialValues = function(realm,avatar) {
  let skill = avatar.stats.skill(realm.elementId);
  skill += avatar.stats.skill(kMineSkill);
  let time = 30 * Math.pow(realm.level, 2) / (skill + 1);
  return {
    skillLevel:skill,
    duration: Math.max(Math.round(time),3),
    usedSkills:[realm.elementId,kMineSkill]
  }
};

const getResult = function(realm,avatar,initial) {

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