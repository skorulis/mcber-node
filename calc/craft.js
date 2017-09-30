let rand = require("./rand");
let ref = require("./reference");
let xp = require("./experience");
let item = require("./item");
let gen = require("./generate");
let Counter = require("../util/Counter");
let ResourceContainer = require("../util/ResourceContainer");

let kCraftSkill = "102";


let initialValues = function(itemRef,avatar) {
  let resources = new ResourceContainer(itemRef.resources,ref.resources,ref.skills,null,1);
  let itemSkill = resources.skillAffiliation();
  let skill = avatar.stats.skill(itemSkill.id);
  skill += avatar.stats.skill(kCraftSkill);

  let time = 10 * Math.pow(resources.totalCost(),1.2) / (skill + 1);
  time = Math.max(Math.round(time),2);
  return {
    skillLevel:skill,
    duration: time,
    usedSkills:[itemSkill.id,kCraftSkill],
    resources:resources.adjustedList
  }
};

let initialGemValues = function(modRef,level,elementRef,avatar) {
  let multiplier = Math.round(Math.pow(level,1.5));
  let resources = new ResourceContainer(modRef.resources,ref.resources,ref.skills,elementRef,multiplier);
  let usedSkill = resources.skillAffiliation();
  let skill = avatar.stats.skill(kCraftSkill) + avatar.stats.skill(usedSkill.id);
  let time = 10 * Math.pow(resources.totalCost(),1.2) / (skill + 1);
  time = Math.max(Math.round(time),2);
  return {
    skillLevel:skill,
    duration: time,
    usedSkills:[usedSkill.id,kCraftSkill],
    resources:resources.adjustedList
  }
};

let getResult = function(itemRef,avatar,initial) {
  let result = {};
  result.experience = xp.craftGain(itemRef,initial);
  result.item = item.fixedItem(itemRef,[]);

  return result;
};

let getActivity = function(itemRef,avatar) {
  let initial = initialValues(itemRef,avatar);
  let activitiy = gen.baseActivity(avatar._id,"craft",initial);
  activitiy.itemId = itemRef.name;
  return activitiy
};

let completeActivity = function(activity,avatar) {
  let itemRef = ref.baseItems.withId(activity.itemId);
  let result = getResult(itemRef,avatar,activity.calculated);
  return result
};

module.exports = {
  initialValues,
  initialGemValues,
  getResult,
  getActivity,
  completeActivity
};