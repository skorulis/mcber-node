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
  let resources = item.gemRefResources(modRef,level,elementRef);
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

let initialSocketValues = function(item,gem,avatar) {
  let skill = avatar.stats.skill(kCraftSkill);
  //let finalLevel =

  return {
    skillLevel:skill,
    duration: time,
    usedSkills:[kCraftSkill],
  }
};

let getResult = function(itemRef,avatar,initial) {
  let result = {};
  result.experience = xp.craftGain(initial);
  result.item = item.fixedItem(itemRef,[]);

  return result;
};

let getGemResult = function(modRef,level,elementRef,avatar,initial) {
  let result = {};
  result.experience = xp.craftGain(initial);
  let elementId = elementRef ? elementRef.id : null;
  result.gem = item.fixedMod(modRef,level,elementId);
  return result;
};

let getActivity = function(itemRef,avatar) {
  let initial = initialValues(itemRef,avatar);
  let activitiy = gen.baseActivity(avatar._id,"craft",initial);
  activitiy.itemId = itemRef.id;
  return activitiy
};

let getGemActivity = function(modRef,level,elementRef,avatar) {
  let initial = initialGemValues(modRef,level,elementRef,avatar);
  let activity = gen.baseActivity(avatar._id,"craft gem",initial);
  let elementId = elementRef ? elementRef.id : null;
  activity.gem = {elementId:elementId,level:level,modId:modRef.id};
  return activity;
};

let completeActivity = function(activity,avatar) {
  let itemRef = ref.baseItems.withId(activity.itemId);
  let result = getResult(itemRef,avatar,activity.calculated);
  return result
};

let completeGemActivity = function(activity,avatar) {
  let modRef = ref.mods.withId(activity.gem.modId);
  let elementRef = ref.skills.withId(activity.gem.elementId);
  let result = getGemResult(modRef,activity.gem.level,elementRef,avatar,activity.calculated);
  return result
};

module.exports = {
  initialValues,
  initialGemValues,
  initialSocketValues,
  getResult,
  getGemResult,
  getActivity,
  getGemActivity,
  completeActivity,
  completeGemActivity
};